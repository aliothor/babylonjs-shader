import './assets/style.css'
import {
    FreeCamera,
    Engine,
    HemisphericLight,
    Vector3,
    CreateGround,
    CreateSphere,
    Scene,
    StandardMaterial,
    Color3,
    Mesh,
    VertexData,
    ArcRotateCamera
} from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials'
import { getGeoJSON } from './share'
import {flatCoordinates} from '../scripts/coord'
import type { FeatureCollection, Polygon } from 'geojson'
import { nanoid } from 'nanoid'
// @ts-expect-error
import { extrudePolygons } from 'poly-extrude'

type ExtrudeResult = {
    position: number[]
    indices: number[]
    normal?: number[]
    uv?: number[]
}

function createMesh(result: ExtrudeResult, scene: Scene) {

    console.log(result);
    
    const { position, indices, normal, uv } = result

    const customMesh = new Mesh(nanoid(), scene)

    const vertexData = new VertexData()
    // VertexData.ComputeNormals(positions, indices, normals)

    vertexData.positions = position
    vertexData.indices = indices

    if (normal) {
        vertexData.normals = normal
    }

    if (uv) {
        vertexData.uvs = uv
    }

    vertexData.applyToMesh(customMesh)

    return customMesh
}

async function createScene() {
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

    const engine = new Engine(canvas)

    const scene = new Scene(engine)

    const camera = new ArcRotateCamera('camera1', 3 * Math.PI / 2, Math.PI / 4, 8, new Vector3(0, 5, -200), scene)

    camera.setTarget(Vector3.Zero())

    camera.attachControl(canvas, true)

    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)

    light.intensity = 0.7

    const mat = new StandardMaterial('mat', scene)

    const jsondata = await getGeoJSON<FeatureCollection<Polygon, any>>('./data/buildings.geojson')
    flatCoordinates(jsondata)

    jsondata.features.forEach(feature => {
        const { type, coordinates } = feature.geometry;
        const result = extrudePolygons(type === 'Polygon' ? [coordinates] : coordinates, { depth: feature.properties.height / 5 });
        const mesh = createMesh(result, scene)
        mesh.material = mat
        console.log(mesh);
        
        camera.setTarget(mesh.position)
    })

    
    engine.runRenderLoop(() => {
        scene.render()
    })
}

createScene()