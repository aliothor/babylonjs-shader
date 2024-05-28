import './assets/style.css'
import {
    Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder, Effect, ShaderMaterial
} from '@babylonjs/core'


function createScene() {
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

    const engine = new Engine(canvas)

    const scene = new Scene(engine)

    const camera = new FreeCamera('camera1', new Vector3(5, 5, -10), scene)

    camera.setTarget(Vector3.Zero())

    camera.attachControl(canvas, true)

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    light.intensity = 0.7

    const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene)

    const box = MeshBuilder.CreateBox('box', { size: 2 })
    box.position.y = 1

    Effect.ShadersStore['customVertexShader'] = `
    precision highp float;

    attribute vec3 position;
    uniform mat4 worldViewProjection;

    void main(){
        vec4 p=vec4(position,1.0);
        gl_Position=worldViewProjection*p;
    }

    `

    Effect.ShadersStore['customFragmentShader'] = `
    precision highp float;

    void main(){
        gl_FragColor=vec4(1.0,0.0,0.0,1.0);
    }
    `

    const shaderMaterial = new ShaderMaterial('custom', scene, 'custom', {})

    box.material = shaderMaterial

    engine.runRenderLoop(() => {
        scene.render()
    })
    
}

createScene()