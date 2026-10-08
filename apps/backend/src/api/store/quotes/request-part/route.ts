import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
  QueryContext,
} from "@medusajs/framework/utils";
import { createCartWorkflow } from "@medusajs/medusa/core-flows";
import { createRequestForQuoteWorkflow } from "../../../../workflows/quote/workflows/create-request-for-quote";
import { RequestPartQuoteType } from "../validators";

/**
 * Asks for a quote on one part that has no listed price, so it can't go in a
 * cart. The part is put in a cart at a price of 0 and sent through the normal
 * request-for-quote flow; the merchant sets the real price on the quote, and
 * the customer accepts or rejects it as for any other quote.
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<RequestPartQuoteType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { variant_id, quantity, region_id } = req.validatedBody;
  const customerId = req.auth_context.actor_id;

  const {
    data: [customer],
  } = await query.graph({
    entity: "customer",
    fields: ["id", "email"],
    filters: { id: customerId },
  });

  const {
    data: [region],
  } = await query.graph({
    entity: "region",
    fields: ["id", "currency_code"],
    filters: { id: region_id },
  });

  if (!customer || !region) {
    return res.status(404).json({ message: "Customer or region not found" });
  }

  // Only parts that are for sale but have no price in this region can be
  // requested this way. A part with a price goes through the cart, so nobody
  // can use this route to put a priced part in at 0.
  const {
    data: [variant],
  } = await query.graph({
    entity: "product_variant",
    fields: [
      "id",
      "product.status",
      "calculated_price.calculated_amount",
    ],
    filters: { id: variant_id },
    context: {
      calculated_price: QueryContext({ currency_code: region.currency_code }),
    },
  });

  if (!variant || variant.product?.status !== ProductStatus.PUBLISHED) {
    return res.status(404).json({ message: "Part not found" });
  }

  const calculated = (
    variant as { calculated_price?: { calculated_amount?: number | null } }
  ).calculated_price;

  if (typeof calculated?.calculated_amount === "number") {
    return res.status(400).json({
      message: "This part has a price; add it to the cart instead.",
    });
  }

  const {
    result: { id: cartId },
  } = await createCartWorkflow(req.scope).run({
    input: {
      region_id: region.id,
      currency_code: region.currency_code,
      customer_id: customer.id,
      email: customer.email ?? undefined,
      items: [{ variant_id, quantity, unit_price: 0 }],
    },
  });

  const {
    result: { quote: createdQuote },
  } = await createRequestForQuoteWorkflow(req.scope).run({
    input: { cart_id: cartId, customer_id: customer.id },
  });

  // The cart only exists to feed the quote. Remove it so the zero-priced line
  // can never be checked out; the merchant's priced quote is what gets accepted.
  await req.scope.resolve(Modules.CART).softDeleteCarts([cartId]);

  const {
    data: [quote],
  } = await query.graph(
    {
      entity: "quote",
      fields: req.queryConfig.fields,
      filters: { id: createdQuote.id },
    },
    { throwIfKeyNotFound: true }
  );

  return res.json({ quote });
};
