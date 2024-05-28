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
  Color3
} from '@babylonjs/core'

import { GridMaterial } from '@babylonjs/materials'

function createScene() {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

  const engine = new Engine(canvas)

  const scene = new Scene(engine)

  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)

  camera.setTarget(Vector3.Zero())

  camera.attachControl(canvas, true)

  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)

  light.intensity = 0.7

  const myMaterial = new StandardMaterial('myMaterial', scene)

  // myMaterial.diffuseColor = new Color3(1, 0, 1)
  myMaterial.specularColor = new Color3(0.5, 0.6, 0.87)
  // myMaterial.emissiveColor = new Color3(1, 1, 1)
  // myMaterial.ambientColor = new Color3(0.23, 0.98, 0.53)

  var material = new GridMaterial('grid', scene)

  var sphere = CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene)

  sphere.position.y = 2

  sphere.material = myMaterial

  var ground = CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene)

  ground.material = myMaterial

  engine.runRenderLoop(() => {
    scene.render()
  })
}

createScene()