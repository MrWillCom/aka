import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import userConfig from '../config'

export const config = {
  runtime: 'edge',
}

const app = new Hono().basePath('/')

app.get('/', c => {
  return c.json({ message: 'Hello Hono!' })
})

userConfig.redirects.forEach(r => {
  app.all(r.from, c => c.redirect(r.to, r.permanent ? 301 : undefined))
})

export default handle(app)
