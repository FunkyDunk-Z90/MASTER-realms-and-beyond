/**
 * Generate RS256 key pair for JWT signing.
 * Run once from the server directory before starting the auth server.
 *
 * Usage:
 *   cd servers/realms-and-beyond-api
 *   npx tsx scripts/generateKeys.ts
 *
 * Creates:
 *   keys/private.pem  — RS256 private key (NEVER commit — already in .gitignore)
 *   keys/public.pem   — RS256 public key (served via GET /.well-known/jwks.json)
 */
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const keysDir = path.join(process.cwd(), 'keys')

if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true })
}

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey, { mode: 0o600 })
fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey)

const keyId = crypto.randomBytes(8).toString('hex')

console.log('')
console.log('✔ Keys generated:')
console.log('  keys/private.pem  — keep secret, never commit')
console.log('  keys/public.pem   — served via /.well-known/jwks.json')
console.log('')
console.log('Add this to your .env:')
console.log(`  JWT_KEY_ID=${keyId}`)
console.log('')
