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

#define green vec3(0.0,0.0,1.0)

// returns a vec3 color from every pixel requested.
// Generates a BnW Ping on normalized 2d coordinate system
vec3 RadarPing(in vec2 uv, in vec2 center, in float innerTail,
               in float frontierBorder, in float timeResetSeconds,
               in float radarPingSpeed, in float fadeDistance)
{
    vec2 diff = center-uv;
    float r = length(diff);
    float time = mod(iTime, timeResetSeconds) * radarPingSpeed;

    float circle;
    // r is the distance to the center.
    // circle = BipCenter---//---innerTail---time---frontierBorder
    //illustration
    //https://sketch.io/render/sk-14b54f90080084bad1602f81cadd4d07.jpeg
    circle += smoothstep(time - innerTail, time, r) * smoothstep(time + frontierBorder,time, r);
	circle *= smoothstep(fadeDistance, 0.0, r); // fade to 0 after fadeDistance

    return vec3(circle);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //normalize coordinates
    vec2 uv = fragCoord.xy / iResolution.xy; //move coordinates to 0..1
    uv = uv.xy*2.; // translate to the center
    uv += vec2(-1.0, -1.0);
    uv.x *= iResolution.x/iResolution.y; //correct the aspect ratio

	vec3 color;
    // generate some radar pings
    float fadeDistance = 1.0;
    float resetTimeSec = 4.0;
    float radarPingSpeed = 0.3;
    vec2 greenPing = vec2(0.0, 0.0);
    color += RadarPing(uv, greenPing, 0.25, 0.025, resetTimeSec, radarPingSpeed, fadeDistance) * green;

    //return the new color
	fragColor = vec4(color,1.0);
}

    void main(){
        mainImage(gl_FragColor,gl_FragCoord.xy);
    }
    `
    const shaderMaterial = new ShaderMaterial('custom', scene, 'custom', {
        attributes: ['position'],
        uniforms: ['worldViewProjection', 'iResolution', 'iTime']
    })

    shaderMaterial.setVector3('iResolution', new Vector3(canvas.width, canvas.height, 1))

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