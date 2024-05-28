import path from 'node:path'
import fs from 'node:fs/promises'

export async function getTemplateName(dir: string) {
    const templateDir = dir
    const inputs: Record<string, string> = {}
    const names = await fs.readdir(templateDir)
    for (const name of names) {
        // inputs[path.basename(name).split('.')[0]] = path.join(templateDir, name)
        inputs[path.basename(name).split('.')[0]]=path.join('./templates',name)
    }
    console.log(inputs);
    return inputs
}
