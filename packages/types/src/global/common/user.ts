// Base user type derived from Zod schemas in @rnb/validators.

export type { T_User } from '@rnb/validators'

// ─── I_* alias for backward compatibility ────────────────────────────────────

import type { T_User } from '@rnb/validators'

export type I_User = T_User
