import {createServer} from 'esbuild-server'
import conf from './conf.js'

const root = './example/'

createServer({
  ...conf(root),
  sourcemap: true
}, {
  static: root,
  port: 3000,
  open: true
}).start()
