declare global {interface Window {__MOMENTGIFT_ASSETS__?:Record<string,string>}}
export function assetUrl(name:string){return window.__MOMENTGIFT_ASSETS__?.[name]??new URL('art/'+name,document.baseURI).href}
