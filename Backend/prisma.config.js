import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Load .env file before Prisma config is parsed
config()

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})