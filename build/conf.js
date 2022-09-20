import { sassPlugin } from 'esbuild-sass-plugin'

export default (dist) => ({
  bundle: true,
  outdir: `${dist || './'}dist/`,
  entryPoints: ['./src/jquartz'],
  plugins: [sassPlugin()]
})
