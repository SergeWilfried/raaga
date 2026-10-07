import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import { ProductStatus } from "@medusajs/framework/utils";
import { readFileSync } from "fs";
import { join } from "path";

type Row = {
  code: string;
  dup: number;
  description: string | null;
  gtin: string | null;
  group: string | null;
  qty: number;
  unit: string | null;
  condition: string | null;
  equipment: string | null;
  equipment_model: string | null;
  equipment_serial: string | null;
  unit_price_xof: number;
};

// XOF is pegged to the euro at a fixed rate; the region sells in EUR.
const XOF_PER_EUR = 655.957;

// Usage: pnpm medusa exec ./src/scripts/seed-products.ts
export default async function seedProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL);
  const productService = container.resolve(Modules.PRODUCT);

  const rows: Row[] = JSON.parse(
    readFileSync(join(process.cwd(), "seed", "products.json"), "utf-8")
  );

  logger.info("Removing existing products and categories...");
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id"],
  });
  if (existingProducts.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: existingProducts.map((p) => p.id) },
    });
  }
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id"],
  });
  if (existingCategories.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: existingCategories.map((c) => c.id),
    });
  }
  const existingCollections = await productService.listProductCollections();
  if (existingCollections.length) {
    await productService.deleteProductCollections(
      existingCollections.map((c) => c.id)
    );
  }

  const [salesChannel] = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  });

  const groups = [...new Set(rows.map((r) => r.group).filter(Boolean))] as string[];
  const { result: categories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: groups.map((name) => ({ name, is_active: true })),
    },
  });

  logger.info(`Seeding ${rows.length} products...`);
  const products = rows.map((r) => {
    const suffix = r.dup > 1 ? `-${r.dup}` : "";
    const sku = `${r.code}${suffix}`;
    const eur = Math.round((r.unit_price_xof / XOF_PER_EUR) * 100) / 100;
    return {
      title: r.description ?? sku,
      handle: `item-${sku}`.toLowerCase(),
      status: ProductStatus.PUBLISHED,
      category_ids: categories.filter((c) => c.name === r.group).map((c) => c.id),
      sales_channels: salesChannel ? [{ id: salesChannel.id }] : [],
      metadata: {
        item_code: r.code,
        gtin: r.gtin,
        unit: r.unit,
        condition: r.condition,
        qty_available: r.qty,
        equipment: r.equipment,
        equipment_model: r.equipment_model,
        equipment_serial: r.equipment_serial,
        unit_price_xof: r.unit_price_xof,
      },
      options: [{ title: "Unit", values: [r.unit ?? "EACH"] }],
      variants: [
        {
          title: r.unit ?? "EACH",
          sku,
          options: { Unit: r.unit ?? "EACH" },
          manage_inventory: false,
          prices: [{ amount: eur, currency_code: "eur" }],
        },
      ],
    };
  });

  const batchSize = 50;
  for (let i = 0; i < products.length; i += batchSize) {
    await createProductsWorkflow(container).run({
      input: { products: products.slice(i, i + batchSize) },
    });
    logger.info(`  ${Math.min(i + batchSize, products.length)}/${products.length}`);
  }
  logger.info("Finished seeding products.");
}
