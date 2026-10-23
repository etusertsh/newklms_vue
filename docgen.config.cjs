// docgen.config.js
import path from 'path'

module.exports = {
    componentsRoot: 'src', // 原始碼根目錄
    //components: 'src/{components,views}/**/*.vue', // 掃描所有的 Components 與 Views
    components: 'src/**/*.{vue,js}',
    outDir: 'docs/components', // 文件產出目標資料夾
    defaultExamples: false,
    getDocFileName: (componentPath) => {
        // 保持原本的目錄結構產出 md 檔
        const { dir, name } = path.parse(componentPath)
        return path.join(dir.replace(/^src\//, ''), `${name}.md`)
    }
}