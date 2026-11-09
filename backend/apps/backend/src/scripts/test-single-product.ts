import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function testSingleProduct({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const { data: [shippingProfile] } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"]
  })

  const { data: [salesChannel] } = await query.graph({
    entity: "sales_channel",
    fields: ["id"]
  })

  logger.info(`Using shipping profile: ${shippingProfile.id}, sales channel: ${salesChannel.id}`)

  try {
    const { result } = await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: "Test Reindeer Sport Jacket",
            handle: "test-reindeer-sport-jacket",
            description: "Test description for reindeer leather jacket",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            sales_channels: [{ id: salesChannel.id }],
            options: [
              { title: "Size", values: ["50"] },
              { title: "Color", values: ["Blue"] }
            ],
            variants: [
              {
                title: "50 / Blue",
                sku: "TEST-JAC-50-BLUE",
                options: {
                  Size: "50",
                  Color: "Blue"
                },
                prices: [
                  {
                    amount: 850,
                    currency_code: "eur"
                  }
                ]
              }
            ],
            images: [
              {
                url: "/catalog-images/thumb_3Y4A0916-Edit-4_1024_ed8450b6-03ab-4ed2-b689-7a44b51b9c8c.jpg"
              }
            ]
          }
        ]
      }
    })

    logger.info(`✅ Successfully created test product! ID: ${result[0].id}, Handle: ${result[0].handle}`)
  } catch (err: any) {
    logger.error(`❌ Failed to create product: ${err.message}`)
    if (err.errors) {
      logger.error(`Details: ${JSON.stringify(err.errors)}`)
    }
  }
}
