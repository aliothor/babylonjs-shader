import './assets/style.css'
import {
    Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder, Effect, ShaderMaterial
} from '@babylonjs/core'


function createScene() {
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement

    const engine = new Engine(canvas)

    const scene = new Scene(engine)

    const camera = new FreeCamera('camera1', new Vector3(0, 0, -10), scene)

    camera.setTarget(Vector3.Zero())

    camera.attachControl(canvas, true)

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    light.intensity = 0.7

    // const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene)

    const plane = MeshBuilder.CreatePlane('box', { size: 6 })

    // plane.position.y = 1

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

    uniform vec3 iResolution;
    uniform float iTime;

    void mainImage(out vec4 fragColor, in vec2 fragCoord){

        vec2 uv=fragCoord/iResolution.xy;

        vec3 col=0.5+0.5*cos(iTime+uv.xyx+vec3(0,2,4));

        fragColor=vec4(col,1.0);

    }

    void main(){
        mainImage(gl_FragColor,gl_FragCoord.xy);
    }
    `
    const shaderMaterial = new ShaderMaterial('custom', scene, 'custom', {
        attributes: ['position'],
        uniforms: ['worldViewProjection', 'iResolution', 'iTime']
    })

    plane.material = shaderMaterial

    shaderMaterial.setVector3('iResolution', new Vector3(canvas.width, canvas.height, 1))

    scene.onBeforeRenderObservable.add(() => {
        const t = performance.now() * 0.001
    
        shaderMaterial.setFloat('iTime', t)
    })

    engine.runRenderLoop(() => {
        scene.render()
    })

}

createScene()