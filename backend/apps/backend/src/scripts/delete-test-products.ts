import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function deleteTestProducts({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const testHandles = [
    "t-shirt",
    "sweatshirt",
    "sweatpants",
    "shorts",
    "test-reindeer-sport-jacket"
  ]

  logger.info(`🔍 Searching for test products with handles: ${testHandles.join(", ")}`)

  const { data: testProducts } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle"],
    filters: {
      handle: testHandles
    }
  })

  if (!testProducts || testProducts.length === 0) {
    logger.info("ℹ️ No test products found.")
    return
  }

  logger.info(`Found ${testProducts.length} test products to delete:`)
  testProducts.forEach((p: any) => logger.info(` - ${p.title} (${p.handle}) [${p.id}]`))

  const idsToDelete = testProducts.map((p: any) => p.id)

  try {
    await deleteProductsWorkflow(container).run({
      input: {
        ids: idsToDelete
      }
    })
    logger.info(`🎉 Successfully deleted ${idsToDelete.length} test products from Medusa!`)
  } catch (err: any) {
    logger.error(`❌ Failed to delete test products: ${err.message}`)
  }
}
