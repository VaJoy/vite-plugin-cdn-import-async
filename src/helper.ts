import { Module } from './type'

let isAsyncHandlerGenerated = false
let isDeferredHandlerGenerate = false

function generateAsyncHandlerTemplate() {
  let result = ''
  if (!isAsyncHandlerGenerated) {
    const asyncHandlerTemplate = `function __cdnImportAsyncHandler(o,n){n&&window.cdnImportAsync_loadingErrorModules.push(o);var d=new CustomEvent("asyncmoduleloaded",{detail:{module:o,isError:!!n}});window.dispatchEvent(d)}window.cdnImportAsync_loadingErrorModules=window.cdnImportAsync_loadingErrorModules||[];`
    result = `<script>${asyncHandlerTemplate}</script>\n`
    isAsyncHandlerGenerated = true
  }
  return result
}

function generateDeferredHandlerTemplate() {
  let result = generateAsyncHandlerTemplate()
  if (!isDeferredHandlerGenerate) {
    isDeferredHandlerGenerate = true
    result += `<script>function __cdnImportAsync_deferredLoader(n,r){var c=document.createElement("script");c.onload=function(){__cdnImportAsyncHandler(n)},c.onerror=function(){__cdnImportAsyncHandler(n,!0)},c.src=r,document.body.appendChild(c)}</script>\n`
  }
  
  return result
}

function generatePrefetchTemplate(url: string) {
  return `<link rel="prefetch" href="${url}" />\n`
}

export function generateScript(url: string, p?: Module) {
  let result = ''
  if (p && (p.mode === 'async' || p.mode === 'defer')) {
    result = generateAsyncHandlerTemplate()
    result += `<script ${p.mode} onload="__cdnImportAsyncHandler('${p.var}')" onerror="__cdnImportAsyncHandler('${p.var}', true)" src="${url}"></script>`
  } else if (p && (p.mode === 'DOMContentLoaded' || p.mode === 'load')) {
    result += generateDeferredHandlerTemplate()
    result += generatePrefetchTemplate(url)
    result += `<script>!function(){window.addEventListener("${p.mode}",function e(){__cdnImportAsync_deferredLoader("${p.var}","${url}"),window.removeEventListener("${p.mode}",e)},!1)}();</script>`
  } else if (p && typeof p.mode === 'string' && p.mode.match(/^[0-9]+$/)) {
    result += generateDeferredHandlerTemplate()
    result += generatePrefetchTemplate(url)
    result += `<script>!function(){window.addEventListener("load",function e(){setTimeout(function(){__cdnImportAsync_deferredLoader("${p.var}","${url}")},${p.mode}),window.removeEventListener("load",e)},!1)}();</script>`
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

    const modeList = ['async', 'defer', 'DOMContentLoaded', 'load']
    modules.forEach(module => {
      const isUsed: boolean | string = usedModules[module.var]
      if (!isUsed) {
        module.ignore = true
      } else if (typeof isUsed === 'string' && (modeList.includes(isUsed) || isUsed.match(/^[0-9]+$/))) {
        module.mode = isUsed
      }
    })
    return `<meta ${contentLeft.trim()} ${contentRight.trim()}>`
  })
}
