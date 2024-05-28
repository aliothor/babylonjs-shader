import { defineConfig, UserConfig } from "@farmfe/core";
import { getTemplateName } from './scripts/util'
import path from 'node:path'

export default async () => {
  const dirname = path.join( './templates')
  console.log('dirname', dirname);
  
  const inputs = await getTemplateName(dirname)
  const config = defineConfig({
    compilation: {
      // input: {
      //   index: "./templates/index.html",
      //   base: "./templates/base.html",
      //   box: "./templates/box.html",
      //   plane: "./templates/plane.html",
      //   texture: "./templates/texture.html",
      // },
      input: inputs,
      output: {
        'publicPath': "/babylonjs-shader/"
      },
      presetEnv: false,
      sourcemap: false
    },
  })
  return config
}
