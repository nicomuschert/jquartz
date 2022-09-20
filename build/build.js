import {build} from 'esbuild'
import conf from './conf.js'

await build({
  ...conf(),
  minify: true,
})

