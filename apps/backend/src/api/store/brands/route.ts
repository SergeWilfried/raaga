import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Brands with the number of published parts each has, busiest first. Read from
 * product metadata, so it needs no search index. Used by the landing page.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const pg = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION);

  const { rows } = await pg.raw(`
    select metadata->>'brand' as brand, count(*)::int as count
    from product
    where deleted_at is null
      and status = 'published'
      and nullif(trim(metadata->>'brand'), '') is not null
    group by 1
    order by 2 desc, 1
    limit 24
  `);

  res.set("Cache-Control", "public, max-age=300");
  res.json({ brands: rows });
};
