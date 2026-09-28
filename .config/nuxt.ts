import { SITE } from "../shared/utils/site";
import icons from "./icons";

export default defineNuxtConfig({
  modules: [
    "nuxt-twitch-ext",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/sitemap",
    "@nuxthub/core",
    "nuxt-ui-colors-no-inline",
    "nuxt-auth-utils"
  ],

  $development: {
    nitro: {
      experimental: {
        websocket: true
      }
    }
  },

  $production: {
    nitro: {
      prerender: {
        autoSubfolderIndex: false,
        crawlLinks: false,
        routes: ["/sitemap.xml"]
      },
      cloudflare: {
        pages: {
          routes: {
            exclude: ["/images/*", "/icons/*"]
          }
        }
      },
      experimental: {
        websocket: true
      }
    }
  },

  devtools: { enabled: false },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: `${SITE.name} | ${SITE.main}`,
      htmlAttrs: {
        lang: "es",
        class: "dark"
      },
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/web-app-manifest-512x512.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/web-app-manifest-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],
      meta: [
        { name: "robots", content: "index, follow" },
        { name: "apple-mobile-web-app-title", content: SITE.name },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "application-name", content: SITE.name },
        { property: "og:site_name", content: SITE.name }
      ]
    }
  },

  css: [
    "~/assets/css/ui.tailwind.css",
    "~/assets/scss/app.scss"
  ],

  site: { url: SITE.host },

  colorMode: {
    preference: "dark",
    fallback: "dark"
  },

  ui: {
    colorMode: true,
    fonts: false,
    theme: {
      colors: ["primary", "secondary", "success", "info", "error"]
    },
    colors: {
      neutral: "slate",
      primary: "red",
      secondary: "emerald"
    }
  },

  runtimeConfig: {
    session: {
      password: "",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    },
    twitchExt: {
      clientId: "",
      secretKey: ""
    }
  },

  features: {
    inlineStyles: false
  },

  experimental: {
    typedPages: true
  },

  compatibilityDate: "2026-09-19",

  hub: {
    kv: true
  },

  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },

  icon: {
    mode: "css",
    provider: "none",
    clientBundle: { icons }
  },

  sitemap: {
    discoverImages: false,
    zeroRuntime: true,
    urls: [
      { loc: "/", priority: 1 }
    ],
    defaults: { priority: 0.8, lastmod: new Date().toISOString() },
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ]
  },

  twitchExt: {
    ebs: {
      baseURL: SITE.host,
      preflight: {
        allowMethods: ["GET", "POST"],
        allowHeaders: ["Content-Type", "Authorization", "Channel-Id"]
      }
    }
  }
});
