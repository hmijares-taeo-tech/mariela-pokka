import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import fs from "fs"
import path from "path"

export default async function seedMarielaPokka({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const jsonPath = "/home/hm1jar3s/Desarrollo/Mariela-Pokka/data/catalog_normalized.json"
  if (!fs.existsSync(jsonPath)) {
    logger.error(`❌ Catalog file not found at: ${jsonPath}`)
    return
  }

  logger.info(`📖 Loading catalog from: ${jsonPath}`)
  const rawCatalog = fs.readFileSync(jsonPath, "utf-8")
  const rawProducts: any[] = JSON.parse(rawCatalog)
  logger.info(`📦 Total products in catalog: ${rawProducts.length}`)

  // 1. Fetch shipping profile and sales channel
  const { data: [shippingProfile] } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"]
  })

  const { data: [salesChannel] } = await query.graph({
    entity: "sales_channel",
    fields: ["id"]
  })

  // 2. Query existing products to avoid duplicate handle errors
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"]
  })
  const existingHandles = new Set(existingProducts.map((p: any) => p.handle))
  logger.info(`ℹ️ Already existing products in database: ${existingHandles.size}`)

  const { data: existingVariants } = await query.graph({
    entity: "product_variant",
    fields: ["sku"]
  })
  const usedSkus = new Set(existingVariants.map((v: any) => v.sku).filter(Boolean))
  logger.info(`ℹ️ Already existing SKUs in database: ${usedSkus.size}`)

  let createdCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (let i = 0; i < rawProducts.length; i++) {
    const raw = rawProducts[i]
    if (existingHandles.has(raw.handle)) {
      skippedCount++
      continue
    }

    // Calcular opciones y valores únicos para este producto
    const optionValuesMap: Record<string, Set<string>> = {}
    
    // Primero registrar opciones explícitas
    if (Array.isArray(raw.options)) {
      raw.options.forEach((optName: string) => {
        if (!optionValuesMap[optName]) optionValuesMap[optName] = new Set()
      })
    }

    // Extraer valores desde las variantes
    if (Array.isArray(raw.variants)) {
      raw.variants.forEach((v: any) => {
        if (v.options && typeof v.options === "object") {
          Object.entries(v.options).forEach(([optName, optVal]) => {
            if (typeof optVal === "string" && optVal.trim()) {
              if (!optionValuesMap[optName]) optionValuesMap[optName] = new Set()
              optionValuesMap[optName].add(optVal.trim())
            }
          })
        }
      })
    }

    // Si no tiene opciones (ej. producto único), crear Default Option
    if (Object.keys(optionValuesMap).length === 0) {
      optionValuesMap["Default Option"] = new Set(["Default"])
    }

    const optionsInput = Object.entries(optionValuesMap).map(([title, valSet]) => ({
      title,
      values: valSet.size > 0 ? Array.from(valSet) : ["Default"]
    }))

    // Preparar variantes para Medusa
    const variantsInput: any[] = []
    if (Array.isArray(raw.variants) && raw.variants.length > 0) {
      raw.variants.forEach((v: any, vIdx: number) => {
        const variantOptions: Record<string, string> = {}
        
        // Mapear opciones asegurando que existan en optionsInput
        optionsInput.forEach(opt => {
          const matchingVal = v.options && v.options[opt.title]
          variantOptions[opt.title] = matchingVal ? String(matchingVal).trim() : opt.values[0]
        })

        const priceEur = v.price_eur > 0 ? v.price_eur : 100 // Fallback si es 0
        let sku = v.sku || `${raw.handle}-${vIdx + 1}`
        if (usedSkus.has(sku)) {
          sku = `${sku}-${vIdx + 1}`
        }
        usedSkus.add(sku)

        variantsInput.push({
          title: v.title || `Variant ${vIdx + 1}`,
          sku: sku.slice(0, 50),
          options: variantOptions,
          prices: [
            {
              amount: priceEur,
              currency_code: "eur"
            }
          ],
          manage_inventory: false
        })
      })
    } else {
      // Crear variante por defecto si no tiene variantes
      variantsInput.push({
        title: "Default",
        sku: `${raw.handle}-default`,
        options: { "Default Option": "Default" },
        prices: [{ amount: 100, currency_code: "eur" }],
        manage_inventory: false
      })
    }

    // Preparar imágenes locales
    const imagesInput: any[] = []
    if (Array.isArray(raw.image_filenames)) {
      raw.image_filenames.forEach((fname: string) => {
        imagesInput.push({
          url: `/catalog-images/${fname}`
        })
      })
    }

    const thumbnail = imagesInput.length > 0 ? imagesInput[0].url : undefined

    try {
      await createProductsWorkflow(container).run({
        input: {
          products: [
            {
              title: raw.title || raw.handle,
              handle: raw.handle,
              description: raw.description || raw.description_html || "",
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              sales_channels: [{ id: salesChannel.id }],
              thumbnail,
              images: imagesInput,
              options: optionsInput,
              variants: variantsInput
            }
          ]
        }
      })
      createdCount++
      if (createdCount % 10 === 0 || i === rawProducts.length - 1) {
        logger.info(`[${i + 1}/${rawProducts.length}] Creados: ${createdCount} | Omitidos: ${skippedCount} | Errores: ${errorCount}`)
      }
    } catch (err: any) {
      errorCount++
      logger.warn(`⚠️ Error en producto '${raw.handle}': ${err.message}`)
    }
  }

  logger.info("\n" + "=".repeat(50))
  logger.info(`🎉 MIGRACIÓN COMPLETADA:`)
  logger.info(`✅ Creados en Medusa: ${createdCount}`)
  logger.info(`⏩ Ya existían: ${skippedCount}`)
  logger.info(`❌ Fallaron: ${errorCount}`)
  logger.info("=".repeat(50))
}
