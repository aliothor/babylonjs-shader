import fs from 'node:fs/promises'
import path from 'node:path'
import { flatCoordinates } from './coord'
import type { FeatureCollection,Polygon } from 'geojson'

async function flat() {
    const jsonpath = path.join(import.meta.dirname, "../data/building.geojson")
    const jsonstr = await fs.readFile(jsonpath, { encoding: "utf-8" })
    const json = JSON.parse(jsonstr) as FeatureCollection<Polygon>
    flatCoordinates(json)
    const first=json.features[0].geometry.coordinates
    console.log(first);
}

flat()


