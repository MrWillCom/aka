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
  app.all(r.from, c => {
    c.status(r.permanent ? 301 : 302)
    c.header('Location', r.to)

    return c.body('Redirecting...')
  })
})

export default handle(app)
