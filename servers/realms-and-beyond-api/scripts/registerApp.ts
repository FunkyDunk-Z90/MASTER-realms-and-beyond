/**
 * Register an OAuth client app with the R&B auth server.
 *
 * Usage (run from the server directory):
 *   cd servers/realms-and-beyond-api
 *
 *   # First-party confidential app (default):
 *   npx tsx scripts/registerApp.ts --name "Aetherscribe" --redirect "http://localhost:3000/auth/callback"
 *
 *   # Multiple redirect URIs:
 *   npx tsx scripts/registerApp.ts --name "ByteBurger" \
 *     --redirect "http://localhost:3003/auth/callback" \
 *     --redirect "https://byteburger.realmsandbeyond.com/auth/callback"
 *
 *   # Third-party public app (no client_secret):
 *   npx tsx scripts/registerApp.ts --name "PartnerApp" \
 *     --redirect "https://partner.io/rnb/callback" \
 *     --public \
 *     --owner-name "Partner Co" \
 *     --owner-email "dev@partner.io"
 *
 * Flags:
 *   --name          App display name (required)
 *   --redirect      Allowed redirect URI (repeatable)
 *   --scope         Allowed scope (repeatable, default: profile email)
 *   --public        Register as a public client (no client_secret, PKCE-only)
 *   --owner-name    Contact name (third-party apps)
 *   --owner-email   Contact email (third-party apps)
 */
import 'dotenv/config'
import { connect, disconnect } from 'mongoose'
import crypto from 'crypto'
import { App } from '@rnb/database'

// ─── Parse CLI args ───────────────────────────────────────────────────────────

function parseArgs(argv: string[]) {
    const args = argv.slice(2)
    const name = getFlag(args, '--name')
    const redirectUris = getAllFlags(args, '--redirect')
    const scopes = getAllFlags(args, '--scope')
    const isPublic = args.includes('--public')
    const ownerName = getFlag(args, '--owner-name')
    const ownerEmail = getFlag(args, '--owner-email')

    if (!name) {
        console.error('Error: --name is required.\n')
        console.error('  npx tsx scripts/registerApp.ts --name "MyApp" --redirect "http://localhost:3000/auth/callback"')
        process.exit(1)
    }

    if (redirectUris.length === 0) {
        console.error('Error: at least one --redirect URI is required.\n')
        console.error('  npx tsx scripts/registerApp.ts --name "MyApp" --redirect "http://localhost:3000/auth/callback"')
        process.exit(1)
    }

    return {
        name,
        redirectUris,
        scopes: scopes.length > 0 ? scopes : ['profile', 'email'],
        isPublic,
        ownerName: ownerName ?? undefined,
        ownerEmail: ownerEmail ?? undefined,
    }
}

function getFlag(args: string[], flag: string): string | null {
    const idx = args.indexOf(flag)
    return idx !== -1 && args[idx + 1] ? (args[idx + 1] ?? null) : null
}

function getAllFlags(args: string[], flag: string): string[] {
    const values: string[] = []
    for (let i = 0; i < args.length; i++) {
        if (args[i] === flag && args[i + 1]) values.push(args[i + 1]!)
    }
    return values
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    const config = parseArgs(process.argv)

    const mongoUri = (process.env.DATABASE ?? '').replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD ?? ''
    )

    if (!mongoUri || mongoUri.includes('<PASSWORD>')) {
        console.error('DATABASE and DATABASE_PASSWORD must be set in .env')
        process.exit(1)
    }

    await connect(mongoUri)

    const clientId = `rnb-${crypto.randomBytes(8).toString('hex')}`
    const clientSecret = config.isPublic ? null : crypto.randomBytes(32).toString('hex')

    const app = await App.create({
        name: config.name,
        clientId,
        clientSecret,
        clientType: config.isPublic ? 'public' : 'confidential',
        redirectUris: config.redirectUris,
        allowedScopes: config.scopes,
        isFirstParty: !config.isPublic,
        ownerName: config.ownerName,
        ownerEmail: config.ownerEmail,
        active: true,
    })

    console.log(`\n✔ "${app.name}" registered successfully:\n`)
    console.log(`  client_id:   ${app.clientId}`)
    if (clientSecret) {
        console.log(`  client_secret: ${clientSecret}`)
        console.log('\n  Add to member app .env:')
        console.log(`  RNB_AUTH_SERVER_URL=http://localhost:2611`)
        console.log(`  RNB_CLIENT_ID=${app.clientId}`)
        console.log(`  RNB_CLIENT_SECRET=${clientSecret}`)
        console.log(`  RNB_REDIRECT_URI=${config.redirectUris[0]}`)
        console.log('\n  ⚠  Copy these values now — the secret is not stored in plaintext.')
    } else {
        console.log('\n  Public client — no client_secret (PKCE only).')
        console.log(`  RNB_AUTH_SERVER_URL=http://localhost:2611`)
        console.log(`  RNB_CLIENT_ID=${app.clientId}`)
        console.log(`  RNB_REDIRECT_URI=${config.redirectUris[0]}`)
    }

    await disconnect()
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
