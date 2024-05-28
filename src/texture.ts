import './assets/style.css'
import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Effect,
    ShaderMaterial,
    Texture
} from '@babylonjs/core'

// @ts-expect-error
import bayer from './assets/bayer.png'


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

    #define TIMESCALE 0.25
    #define TILES 8
    #define COLOR 0.7, 1.6, 2.8

    uniform vec3 iResolution;
    uniform float iTime;
    uniform sampler2D iChannel0;

    void mainImage(out vec4 fragColor, in vec2 fragCoord){
        vec2 uv = fragCoord.xy / iResolution.xy;
        uv.x *= iResolution.x / iResolution.y;

        vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
        float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
        p = min(max(p * 3.0 - 1.8, 0.1), 2.0);

        vec2 r = mod(uv * float(TILES), 1.0);
        r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
        p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);

        fragColor = vec4(COLOR, 1.0) * p;
    }

    void main(){
        mainImage(gl_FragColor,gl_FragCoord.xy);
    }
    `
    const shaderMaterial = new ShaderMaterial('custom', scene, 'custom', {
        attributes: ['position'],
        uniforms: ['worldViewProjection', 'iResolution', 'iTime'],
        samplers: ['iChannel0']
    })
    shaderMaterial.setVector3('iResolution', new Vector3(canvas.width, canvas.height, 1))
    shaderMaterial.setTexture('iChannel0', new Texture(bayer, scene))

    plane.material = shaderMaterial


    scene.onBeforeRenderObservable.add(() => {
        const t = performance.now() * 0.001
        shaderMaterial.setFloat('iTime', t)
    })

    engine.runRenderLoop(() => {
        scene.render()
    })

}

createScene()