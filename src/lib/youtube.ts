import { Innertube, Platform, UniversalCache, type Types } from 'youtubei.js/web'
import { proxyFetch } from './helpers'

Platform.shim.eval = async (
  data: Types.BuildScriptResult,
  env: Record<string, Types.VMPrimative>
) => {
  const properties = []

  if (env.n) {
    properties.push(`n: exportedVars.nFunction("${env.n}")`)
  }

  if (env.sig) {
    properties.push(`sig: exportedVars.sigFunction("${env.sig}")`)
  }

  const code = `${data.output}\nreturn { ${properties.join(', ')} }`

  return new Function(code)()
}

const init = async () => {
  const instance = await Innertube.create({
    cache: new UniversalCache(true),
    fetch: proxyFetch,
    cookie: localStorage.getItem('yt-cookie') || undefined
  })

  return instance
}

export const yt = await init()
