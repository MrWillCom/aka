import 'dotenv/config'

import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import userConfig from '../config.js'

const app = new Hono()

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
      ce('p', null, '© 2024–' + new Date().getFullYear() + ' Mr. Will'),
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
  app.all(r.from, c => {
    return c.redirect(r.to, r.permanent ? 301 : undefined)
  })
})

if (process.env.VERCEL !== '1') {
  serve(
    {
      fetch: app.fetch,
      port: 3000,
    },
    info => {
      console.log(`Server is running on http://localhost:${info.port}`)
    },
  )
}

export default app
