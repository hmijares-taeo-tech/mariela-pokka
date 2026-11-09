import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs"
import path from "path"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const rawParam = req.params.filename || ""
    const cleanFilename = path.basename(decodeURIComponent(rawParam))
    
    // Resolve absolute path to data/images
    const candidates = [
      "/data/images/" + cleanFilename,
      "/app/public/catalog-images/" + cleanFilename,
      path.resolve(process.cwd(), "../../data/images", cleanFilename),
      path.resolve(process.cwd(), "data/images", cleanFilename),
      path.join("/home/hm1jar3s/Desarrollo/Mariela-Pokka/data/images", cleanFilename)
    ]

    let foundPath: string | null = null
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        foundPath = p
        break
      }
    }

    if (!foundPath) {
      return res.status(404).json({ message: `Image ${cleanFilename} not found` })
    }

    const stat = fs.statSync(foundPath)
    res.writeHead(200, {
      "Content-Type": cleanFilename.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
      "Content-Length": stat.size,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    })

    const readStream = fs.createReadStream(foundPath)
    return readStream.pipe(res)
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Internal server error" })
  }
}
