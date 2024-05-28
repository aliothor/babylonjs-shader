import { defineConfig } from "@farmfe/core";

export default defineConfig({
  compilation: {
    input: {
      index: "./templates/index.html",
      base: "./templates/base.html",
      box: "./templates/box.html",
      plane: "./templates/plane.html",
      texture: "./templates/texture.html",
    },
    output:{
      'publicPath':"/babylonjs-shader/"
    },
    presetEnv: false,
    sourcemap: false
  },
})
