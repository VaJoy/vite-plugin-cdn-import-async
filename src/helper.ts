import { Module } from './type'

let isAsyncHandlerGenerated = false

const asyncHandlerTemplate = `function __cdnImportAsyncHandler(o,n){n&&window.cdnImportAsync_loadingErrorModules.push(o);var d=new CustomEvent("asyncmoduleloaded",{detail:{module:o,isError:!!n}});window.dispatchEvent(d)}window.cdnImportAsync_loadingErrorModules=window.cdnImportAsync_loadingErrorModules||[];`

export function generateScript(url: string, p?: Module) {
  let result = ''
  if (p && (p.mode === 'async' || p.mode === 'defer')) {
    if (!isAsyncHandlerGenerated) {
      result = `<script>${asyncHandlerTemplate}</script>\n`
      isAsyncHandlerGenerated = true
    }
    result += `<script ${p.mode} onload="__cdnImportAsyncHandler('${p.var}')" onerror="__cdnImportAsyncHandler('${p.var}', true)" src="${url}"></script>`
  } else {
    result = `<script src="${url}"></script>`
  }

  return result
}

const metaReg = new RegExp(/<meta(\s[^>]*?)data-cdn-import=["']([^'"]+?)["']([^>]*?)>/)

export function filterModulesByInputHtml(html: string, modules: Module[]) {
  const usedModules: any = {}
  return html.replace(metaReg, (_, contentLeft = '', markedModules: string, contentRight = '') => {
    markedModules.split(',').forEach(v => {
      v = v.trim()
      const varAndMode = v.split('@')
      const moduleVar = varAndMode[0] as string
      if (moduleVar) {
        usedModules[moduleVar] = varAndMode[1] || true
      }
    })
    modules.forEach(module => {
      const isUsed: boolean | string = usedModules[module.var]
      if (!isUsed) {
        module.ignore = true
      } else if (isUsed === 'async' || isUsed === 'defer') {
        module.mode = isUsed
      }
    })
    return `<meta ${contentLeft.trim()} ${contentRight.trim()}>`
  })
}
