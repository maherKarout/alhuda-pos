/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FALLBACK_LNG: string
  readonly VITE_API_PROTOCOL: string
  readonly VITE_API_HOST: string
  readonly VITE_API_PORT: string
  readonly VITE_API_PREFIX: string
  readonly VITE_API_VERSION1: string
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}

declare module '*.webp' {
  const value: string
  export default value
}
