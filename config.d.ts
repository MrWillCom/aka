interface Redirect {
  from: string
  to: string
  permanent?: boolean
}

declare const config: { redirects: Redirect[] }

export default config
