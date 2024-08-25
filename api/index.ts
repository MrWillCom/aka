import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { Redis } from '@upstash/redis'
import userConfig from '../config'

export const config = {
  runtime: 'edge',
}

const app = new Hono().basePath('/')

app.get('/', c => {
  const ce = (tag: string, attr?: string | null, children?: string | null) =>
    `<${tag} ${attr ?? ''}>${children ?? ''}</${tag}>`

  let html = ''
  html += ce('h1', null, 'aka')
  html += ce('p', null, 'A tiny redirector for shortening links.')
  html += ce('p', null, 'Redirects:')
  html += ce(
    'ul',
    null,
    userConfig.redirects
      .map(r =>
        ce(
          'li',
          null,
          ce('a', `href="${r.from}"`, ce('pre', null, `${r.from} -> ${r.to}`)),
        ),
      )
      .join(''),
  )
  html += ce(
    'footer',
    null,
    [
      ce('p', null, '© 2024 Mr. Will'),
      ce(
        'p',
        null,
        [
          ce(
            'a',
            'href="https://github.com/MrWillCom/aka" target="_blank"',
            'Source Code',
          ),
          '<br />',
          'Powered by ',
          ce('a', 'href="https://hono.dev/" target="_blank"', 'Hono'),
        ].join(''),
      ),
    ].join(''),
  )
  return c.html(html)
})

userConfig.redirects.forEach(r => {
  app.all(r.from, async c => {
    const redis = Redis.fromEnv()
    await redis.lpush(r.from, Date.now())

    return c.redirect(r.to, r.permanent ? 301 : undefined)
  })
})

export default handle(app)
