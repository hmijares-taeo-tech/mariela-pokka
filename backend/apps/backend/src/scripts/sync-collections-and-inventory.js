const { Client } = require('pg');
const fs = require('fs');

async function syncCollectionsAndInventory() {
  const client = new Client({
    connectionString: 'postgres://postgres:postgres@localhost:5432/medusa-mariela'
  });

  await client.connect();
  console.log(" Connected to PostgreSQL");

  const raw = fs.readFileSync('/home/hm1jar3s/Desarrollo/Mariela-Pokka/data/catalog_normalized.json', 'utf-8');
  const products = JSON.parse(raw);

  // 1. Crear las 6 Colecciones Oficiales de Mariela Pokka
  console.log("\n📦 1. Sincronizando Colecciones Oficiales...");
  const collections = [
    { id: 'col_outerwear_mp', title: 'Trenches & Outerwear', handle: 'outerwear' },
    { id: 'col_jackets_mp', title: 'Tailored Jackets & Suits', handle: 'jackets' },
    { id: 'col_dresses_mp', title: 'Dresses & Skirts', handle: 'dresses' },
    { id: 'col_pants_mp', title: 'Pants, Shorts & Bermudas', handle: 'pants' },
    { id: 'col_blouses_mp', title: 'Blouses, Shirts & Tops', handle: 'blouses' },
    { id: 'col_accessories_mp', title: 'Accessories & Fine Leather Goods', handle: 'accessories' }
  ];

  for (const c of collections) {
    await client.query(`
      INSERT INTO product_collection (id, title, handle, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, handle = EXCLUDED.handle;
    `, [c.id, c.title, c.handle]);
  }
  console.log(`✅ ${collections.length} colecciones creadas/actualizadas.`);

  // 2. Mapear cada producto a su colección según su tipo
  console.log("\n🏷️ 2. Asignando productos a sus colecciones...");
  function getCollectionId(type, title) {
    const t = (type || '').toLowerCase();
    const tit = (title || '').toLowerCase();

    if (t.includes('trench') || t.includes('vest') || tit.includes('trench') || tit.includes('vest')) {
      return 'col_outerwear_mp';
    }
    if (t.includes('jacket') || t.includes('blazer') || t.includes('suit') || tit.includes('jacket') || tit.includes('blazer') || tit.includes('suit')) {
      return 'col_jackets_mp';
    }
    if (t.includes('dress') || t.includes('skirt') || tit.includes('dress') || tit.includes('skirt')) {
      return 'col_dresses_mp';
    }
    if (t.includes('pant') || t.includes('short') || t.includes('bermuda') || tit.includes('pant') || tit.includes('short') || tit.includes('bermuda')) {
      return 'col_pants_mp';
    }
    if (t.includes('blouse') || t.includes('shirt') || t.includes('top') || tit.includes('blouse') || tit.includes('shirt') || tit.includes('top')) {
      return 'col_blouses_mp';
    }
    return 'col_accessories_mp';
  }

  let mappedCount = 0;
  for (const p of products) {
    const colId = getCollectionId(p.type, p.title);
    await client.query(`
      UPDATE product SET collection_id = $1 WHERE handle = $2;
    `, [colId, p.handle]);
    mappedCount++;
  }
  console.log(`✅ ${mappedCount} productos asignados a sus colecciones correspondientes.`);

  // 3. Sincronizar Inventario Real de cada Variante
  console.log("\n📊 3. Sincronizando Inventario Exacto por Variante...");
  const stockLocationRes = await client.query(`SELECT id FROM stock_location LIMIT 1;`);
  const stockLocationId = stockLocationRes.rows[0]?.id || 'sloc_01M5JF7HMNPY5B04W45SA0JB1P';
  console.log(`📍 Almacén de inventario: ${stockLocationId}`);

  // Habilitar manage_inventory en todas las variantes
  await client.query(`UPDATE product_variant SET manage_inventory = true, allow_backorder = false;`);

  // Obtener variantes actuales de la base de datos
  const dbVariantsRes = await client.query(`SELECT id, sku, product_id FROM product_variant;`);
  const dbVariantsBySku = new Map();
  dbVariantsRes.rows.forEach(r => {
    if (r.sku) dbVariantsBySku.set(r.sku, r);
  });

  let inventoryCreated = 0;
  let inStockCount = 0;

  for (const p of products) {
    if (!Array.isArray(p.variants)) continue;

    for (let vIdx = 0; vIdx < p.variants.length; vIdx++) {
      const v = p.variants[vIdx];
      const baseSku = v.sku || `${p.handle}-${vIdx + 1}`;
      
      // Buscar variante en DB (puede tener sufijo de deduplicación)
      let dbVar = dbVariantsBySku.get(baseSku);
      if (!dbVar) {
        dbVar = dbVariantsBySku.get(`${baseSku}-${vIdx + 1}`);
      }

      if (!dbVar) continue;

      const qty = v.inventory_quantity !== undefined ? Number(v.inventory_quantity) : 0;
      if (qty > 0) inStockCount++;

      const invItemId = `inv_item_${dbVar.id}`;
      const invLinkKey = `inv_link_${dbVar.id}`;
      const invLevelId = `inv_lvl_${dbVar.id}`;

      // 1. Insertar item de inventario
      await client.query(`
        INSERT INTO inventory_item (id, sku, title, requires_shipping, created_at, updated_at)
        VALUES ($1, $2, $3, true, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET sku = EXCLUDED.sku;
      `, [invItemId, baseSku.slice(0, 50), v.title || baseSku]);

      // 2. Vincular variante con item de inventario
      await client.query(`
        INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity, created_at, updated_at)
        VALUES ($1, $2, $3, 1, NOW(), NOW())
        ON CONFLICT (variant_id, inventory_item_id) DO NOTHING;
      `, [invLinkKey, dbVar.id, invItemId]);

      // 3. Establecer nivel de inventario en el almacén
      const rawQty = JSON.stringify({ value: String(qty), precision: 20 });
      const rawZero = JSON.stringify({ value: "0", precision: 20 });
      await client.query(`
        INSERT INTO inventory_level (id, inventory_item_id, location_id, stocked_quantity, reserved_quantity, incoming_quantity, raw_stocked_quantity, raw_reserved_quantity, raw_incoming_quantity, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 0, 0, $5, $6, $7, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET 
          stocked_quantity = EXCLUDED.stocked_quantity,
          raw_stocked_quantity = EXCLUDED.raw_stocked_quantity,
          updated_at = NOW();
      `, [invLevelId, invItemId, stockLocationId, qty, rawQty, rawZero, rawZero]);

      inventoryCreated++;
    }
  }

  console.log(`✅ ${inventoryCreated} niveles de inventario sincronizados.`);
  console.log(`📈 Variantes con stock disponible (>0): ${inStockCount}`);

  await client.end();
  console.log("\n🎉 ¡Sincronización completa de colecciones e inventario finalizada!");
}

syncCollectionsAndInventory().catch(err => {
  console.error("❌ Error en sincronización:", err);
  process.exit(1);
});
