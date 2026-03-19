/**
 * Register a third-party (public) OAuth client app.
 * Public clients use PKCE only — no client_secret.
 *
 * Usage (run from the server directory):
 *   cd servers/realms-and-beyond-api
 *   npx tsx scripts/registerPublicApp.ts
 */
import 'dotenv/config'
import { connect, disconnect } from 'mongoose'
import crypto from 'crypto'
import { App } from '@rnb/database'

// ─── Configure the third-party app ───────────────────────────────────────────

const APP_CONFIG = {
    name: 'Partner App',
    clientType: 'public' as const,
    isFirstParty: false,
    redirectUris: [
        'https://partner-app.io/rnb/callback',
    ],
    allowedScopes: ['profile', 'email'],
    ownerName: 'Partner Company',
    ownerEmail: 'dev@partner-app.io',
}

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
    const mongoUri = (process.env.DATABASE ?? '').replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD ?? ''
    )

    if (!mongoUri || mongoUri.includes('<PASSWORD>')) {
        console.error('DATABASE and DATABASE_PASSWORD must be set in .env')
        process.exit(1)
    }

    await connect(mongoUri)
    console.log('Connected to database.')

    const clientId = `ext-${crypto.randomBytes(8).toString('hex')}`

    const app = await App.create({
        name: APP_CONFIG.name,
        clientId,
        clientSecret: null, // public clients have no secret — PKCE only
        clientType: APP_CONFIG.clientType,
        redirectUris: APP_CONFIG.redirectUris,
        allowedScopes: APP_CONFIG.allowedScopes,
        ownerName: APP_CONFIG.ownerName,
        ownerEmail: APP_CONFIG.ownerEmail,
        isFirstParty: APP_CONFIG.isFirstParty,
        active: true,
    })

    console.log('\n✔ Public app registered:\n')
    console.log(`  Name:      ${app.name}`)
    console.log(`  client_id: ${app.clientId}`)
    console.log('  No client_secret — public clients use PKCE only.')

    await disconnect()
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
