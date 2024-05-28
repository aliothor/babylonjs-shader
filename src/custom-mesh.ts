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
    DirectionalLight
} from '@babylonjs/core'

import { GridMaterial } from '@babylonjs/materials'

function createScene() {
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

    const engine = new Engine(canvas)

    const scene = new Scene(engine)

    const camera = new FreeCamera('camera1', new Vector3(0, -15, -10), scene)

    camera.setTarget(Vector3.Zero())

    camera.attachControl(canvas, true)

    const light = new DirectionalLight('light1', new Vector3(0, 0, 1), scene)

    light.intensity = 0.7

    const customMesh = new Mesh('custom', scene)

    const positions = [-5, 2, -3, -7, -2, -3, -3, -2, -3, 5, 2, 3, 7, -2, 3, 3, -2, 3];
    const indices = [0, 1, 2, 3, 4, 5];
    const normals: number[] = []

    const vertexData = new VertexData()
    VertexData.ComputeNormals(positions, indices, normals)

    vertexData.positions = positions
    vertexData.indices = indices
    vertexData.normals = normals

    vertexData.applyToMesh(customMesh)

    const mat = new StandardMaterial('mat', scene)
    // mat.wireframe = true
    mat.backFaceCulling = false
    customMesh.material = mat

    engine.runRenderLoop(() => {
        scene.render()
    })
}

createScene()