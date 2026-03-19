#!/bin/bash
# Generate RS256 key pair for JWT signing.
# Run once from the server directory before starting the auth server.
#
# Usage:
#   cd servers/realms-and-beyond-api
#   bash scripts/generateKeys.sh

set -e

mkdir -p keys

openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem

echo ""
echo "✔ Keys generated:"
echo "  keys/private.pem  — keep secret, never commit"
echo "  keys/public.pem   — safe to share, used by JWKS endpoint"
echo ""
echo "Generate a JWT_KEY_ID:"
node -e "console.log('  JWT_KEY_ID=' + require('crypto').randomBytes(8).toString('hex'))"
echo ""
echo "Add JWT_KEY_ID to your .env file."
