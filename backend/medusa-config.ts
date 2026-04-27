import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const BACKEND_URL  = process.env.BACKEND_URL  || 'http://localhost:9000'

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      // Railway assigne un PORT dynamique — Medusa doit l'écouter absolument
      port: parseInt(process.env.PORT || '9000'),
      storeCors: process.env.STORE_CORS || `${FRONTEND_URL},http://localhost:3000`,
      adminCors: process.env.ADMIN_CORS || `${BACKEND_URL},http://localhost:9000,http://localhost:5173`,
      authCors:  process.env.AUTH_CORS  || `${BACKEND_URL},http://localhost:9000,http://localhost:5173`,
      jwtSecret:    process.env.JWT_SECRET    || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    }
  },
  modules: [
    {
      resolve: './src/modules/mlm'
    }
  ]
})
