/**
 * seed.ts — First-time database initialisation
 *
 * Creates:
 *   1. The Aetherscribe OAuth application record (confidential client)
 *   2. The CEO / super-admin Identity
 *
 * Run with:
 *   pnpm seed
 *   — or —
 *   npx tsx scripts/seed.ts
 *
 * Idempotent: skips creation if the record already exists.
 */

import 'dotenv/config'
import { connect, disconnect } from 'mongoose'
import { env } from '../src/config/validateEnv'
import { App, Identity } from '@rnb/database'

// ─── Config ───────────────────────────────────────────────────────────────────

const AETHERSCRIBE_APP = {
    name: 'Aetherscribe',
    clientId: 'rnb-d34f123619c58ac7',
    clientSecret: 'f5ad40faa1376beef39218dcb9a101005ca9df02eac180d0084a6c158fc40c9a',
    clientType: 'confidential' as const,
    redirectUris: ['http://localhost:3000/api/auth/callback'],
    allowedScopes: ['profile', 'email', 'openid'],
    isFirstParty: true,
    active: true,
}

// ─── Prompt helper ────────────────────────────────────────────────────────────

async function prompt(question: string): Promise<string> {
    process.stdout.write(question)
    return new Promise((resolve) => {
        let data = ''
        process.stdin.setEncoding('utf8')
        process.stdin.resume()
        process.stdin.once('data', (chunk) => {
            data = String(chunk).trim()
            process.stdin.pause()
            resolve(data)
        })
    })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed(): Promise<void> {
    const dbUri = env.DATABASE.replace('<PASSWORD>', env.DATABASE_PASSWORD)
    console.log('\n🔌 Connecting to database...')
    await connect(dbUri)
    console.log('✅ Connected.\n')

    // ── 1. Register Aetherscribe OAuth App ────────────────────────────────────

    const existingApp = await App.findOne({ clientId: AETHERSCRIBE_APP.clientId })

    if (existingApp) {
        console.log(`ℹ  App "${AETHERSCRIBE_APP.name}" already registered (clientId: ${AETHERSCRIBE_APP.clientId}) — skipping.`)
    } else {
        await App.create(AETHERSCRIBE_APP)
        console.log(`✅ App "${AETHERSCRIBE_APP.name}" registered.`)
        console.log(`   clientId:     ${AETHERSCRIBE_APP.clientId}`)
        console.log(`   clientType:   ${AETHERSCRIBE_APP.clientType}`)
        console.log(`   redirectUri:  ${AETHERSCRIBE_APP.redirectUris[0]}`)
        console.log(`   isFirstParty: ${AETHERSCRIBE_APP.isFirstParty}\n`)
    }

    // ── 2. Create CEO Identity ────────────────────────────────────────────────

    const adminEmail = await prompt('Enter your email address: ')
    const firstName  = await prompt('First name: ')
    const lastName   = await prompt('Last name: ')
    const password   = await prompt('Password (min 8 chars): ')

    const normalizedEmail = adminEmail.trim().toLowerCase()
    const existing = await Identity.findOne({ 'profile.email': normalizedEmail })

    if (existing) {
        console.log(`\nℹ  Identity for ${normalizedEmail} already exists — skipping user creation.`)
    } else {
        const identity = new Identity({
            profile: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: normalizedEmail,
            },
            security: {
                trustedDevices: [],
            },
            preferences: {
                language: 'en',
                timezone: 'UTC',
                theme: 'system',
            },
            verification: {
                emailVerified: true,   // CEO — pre-verified
                phoneVerified: false,
                identityVerified: false,
                twoFactorEnabled: false,
            },
            lifecycle: {
                status: 'active',
            },
            audit: {
                marketingConsent: false,
            },
            ventures: [],
        })

        await identity.setPassword({ plaintext: password })
        console.log(`\n✅ CEO identity created.`)
        console.log(`   Name:  ${firstName.trim()} ${lastName.trim()}`)
        console.log(`   Email: ${normalizedEmail}`)
        console.log(`   ID:    ${identity._id.toString()}`)
    }

    console.log('\n🏁 Seed complete.\n')
    await disconnect()
    process.exit(0)
}

seed().catch((err) => {
    console.error('\n❌ Seed failed:', err)
    process.exit(1)
})
