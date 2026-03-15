import type {
  T_NavSection,
  T_TechStack,
  T_Product,
  T_Package,
  T_Convention,
} from "./schemas";

export const NAV_SECTIONS: T_NavSection[] = [
  {
    id: "overview",
    label: "Overview",
    href: "#overview",
    subsections: [
      { id: "products", label: "Products", href: "#products" },
      { id: "philosophy", label: "Core Philosophy", href: "#philosophy" },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    href: "#architecture",
    subsections: [
      { id: "workspace", label: "Workspace Structure", href: "#workspace" },
      { id: "turborepo", label: "Turborepo Pipeline", href: "#turborepo" },
    ],
  },
  { id: "stack", label: "Tech Stack", href: "#stack" },
  { id: "setup", label: "Dev Setup", href: "#setup" },
  {
    id: "packages",
    label: "Packages",
    href: "#packages",
    subsections: [
      { id: "pkg-errors", label: "@rnb/errors", href: "#pkg-errors" },
      {
        id: "pkg-validators",
        label: "@rnb/validators",
        href: "#pkg-validators",
      },
      {
        id: "pkg-middleware",
        label: "@rnb/middleware",
        href: "#pkg-middleware",
      },
      { id: "pkg-security", label: "@rnb/security", href: "#pkg-security" },
      { id: "pkg-database", label: "@rnb/database", href: "#pkg-database" },
      { id: "pkg-ui", label: "@rnb/ui", href: "#pkg-ui" },
      { id: "pkg-styles", label: "@rnb/styles", href: "#pkg-styles" },
    ],
  },
  { id: "auth", label: "Auth & Identity", href: "#auth" },
  { id: "api", label: "API Reference", href: "#api" },
  { id: "conventions", label: "Code Conventions", href: "#conventions" },
  {
    id: "components",
    label: "UI Components",
    href: "#components",
    subsections: [
      { id: "comp-buttons", label: "Button", href: "#comp-buttons" },
      { id: "comp-cards", label: "Card", href: "#comp-cards" },
      { id: "comp-frames", label: "Frame · Panel", href: "#comp-frames" },
      { id: "comp-decorative", label: "Seal · Toast", href: "#comp-decorative" },
      { id: "comp-cartridge", label: "CartridgeCard", href: "#comp-cartridge" },
      { id: "comp-dropdown", label: "Dropdown", href: "#comp-dropdown" },
      { id: "comp-code-snippet", label: "CodeSnippet", href: "#comp-code-snippet" },
      { id: "comp-tokens", label: "Design Tokens", href: "#comp-tokens" },
    ],
  },
  { id: "deps", label: "Dependency Graph", href: "#deps" },
];

export const TECH_STACKS: T_TechStack[] = [
  {
    label: "Backend",
    entries: [
      { concern: "Runtime", technology: "Node.js 20+" },
      { concern: "Framework", technology: "Express 5" },
      { concern: "Language", technology: "TypeScript 5 (ESM)" },
      { concern: "Database", technology: "MongoDB / Mongoose 9" },
      {
        concern: "Authentication",
        technology: "JWT (HS256) + httpOnly cookies",
      },
      { concern: "Password hashing", technology: "bcrypt (12 rounds)" },
      { concern: "Token security", technology: "SHA-256, timing-safe compare" },
      { concern: "Env validation", technology: "envalid" },
      { concern: "Dev server", technology: "tsx watch" },
    ],
  },
  {
    label: "Frontend",
    entries: [
      { concern: "Framework", technology: "Next.js 14+ (App Router)" },
      { concern: "Language", technology: "TypeScript 5" },
      { concern: "Styling", technology: "SCSS / CSS Modules" },
      { concern: "State", technology: "React Context" },
      { concern: "Icons", technology: "lucide-react" },
      { concern: "Image handling", technology: "next/image" },
    ],
  },
  {
    label: "Shared",
    entries: [
      { concern: "Validation", technology: "Zod v4" },
      { concern: "Package manager", technology: "pnpm 9+" },
      { concern: "Build orchestration", technology: "Turborepo" },
      { concern: "Type safety", technology: "TypeScript strict mode" },
    ],
  },
];

export const PRODUCTS: T_Product[] = [
  {
    name: "Aetherscribe",
    type: "Web App + API",
    purpose: "RPG worldbuilding and campaign management",
    icon: "⚔️",
  },
  {
    name: "ByteBurger",
    type: "Web App",
    purpose: "Online food ordering",
    icon: "🍔",
  },
  {
    name: "NexusServe",
    type: "Web App + API",
    purpose: "Restaurant point-of-sale and management",
    icon: "🖥️",
  },
  {
    name: "Realms Portal",
    type: "Web App",
    purpose: "Platform hub (landing/routing)",
    icon: "🌐",
  },
  {
    name: "Documentation",
    type: "Web App",
    purpose: "Internal component and design-system docs",
    icon: "📚",
  },
];

export const PACKAGES: T_Package[] = [
  {
    name: "@rnb/errors",
    path: "packages/errors/",
    description:
      "Provides a single AppError class for all expected, operational errors. Controllers throw AppError instances; the global error handler catches and formats responses.",
    consumedBy: "All Express servers, @rnb/middleware",
    exports: ["AppError"],
  },
  {
    name: "@rnb/validators",
    path: "packages/validators/",
    description:
      "Single source of truth for all data shapes. Contains Zod schemas, inferred TypeScript types, and environment validation via envalid.",
    consumedBy: "All packages and servers",
    exports: ["Z_* schemas", "T_* types", "env"],
  },
  {
    name: "@rnb/middleware",
    path: "packages/middleware/",
    description:
      "Express middleware for authentication, CRUD factories, token utilities, and global error handling.",
    consumedBy: "All Express servers",
    exports: [
      "authenticate",
      "globalErrorHandler",
      "catchAsync",
      "createOne",
      "getAll",
      "getOne",
      "updateOne",
      "deleteOne",
    ],
  },
  {
    name: "@rnb/security",
    path: "packages/security/",
    description:
      "All JWT token and cookie operations. Separates token lifecycle concerns from controllers.",
    consumedBy: "All Express servers",
    exports: [
      "createToken",
      "verifyToken",
      "setAuthCookie",
      "clearCookie",
      "extractToken",
      "formatEmail",
    ],
  },
  {
    name: "@rnb/database",
    path: "packages/database/",
    description:
      "All Mongoose models. Centralises schema changes so multiple servers share collections without reimplementing schemas.",
    consumedBy: "realms-and-beyond-api, aetherscribe-api",
    exports: ["Identity", "AetherscribeProfile", "connectDatabase"],
  },
  {
    name: "@rnb/ui",
    path: "packages/ui/",
    description:
      "Shared React component library. All UI primitives (buttons, inputs, cards, modals) with full theme support.",
    consumedBy: "All Next.js apps",
    exports: ["Button", "Input", "Card", "Modal", "Navbar", "AuthGuard"],
  },
  {
    name: "@rnb/styles",
    path: "packages/styles/",
    description:
      "SCSS design system. Variables, mixins, themes, animations, and utility classes.",
    consumedBy: "All Next.js apps",
    exports: ["global.scss", "_variables.scss", "_mixins.scss", "_themes.scss"],
  },
];

export const CONVENTIONS: T_Convention[] = [
  {
    type: "Interface",
    convention: "I_ prefix, PascalCase",
    example: "I_AuthUser, I_ButtonProps",
  },
  {
    type: "Type alias",
    convention: "T_ prefix, PascalCase",
    example: "T_BtnVariant, T_SubscriptionPlan",
  },
  {
    type: "Zod schema",
    convention: "Z_ prefix, PascalCase",
    example: "Z_SetPassword, Z_IdentitySchema",
  },
  {
    type: "Inferred Zod type",
    convention: "T_ prefix",
    example: "type T_Identity = z.infer<typeof Z_IdentitySchema>",
  },
  {
    type: "React component",
    convention: "PascalCase",
    example: "AuthForm, Navbar",
  },
  {
    type: "Function/variable",
    convention: "camelCase",
    example: "buildIdentityDefaults, setAuthCookie",
  },
  {
    type: "Constant",
    convention: "SCREAMING_SNAKE_CASE",
    example: "SUBSCRIPTION_LIMITS, AUTH_COOKIE_NAME",
  },
  {
    type: "SCSS variable",
    convention: "$kebab-case",
    example: "$font-display, $obsidian-mid",
  },
  {
    type: "CSS class",
    convention: ".kebab-case / BEM",
    example: ".plan-card, .plan-card--selected",
  },
];

export const TURBOREPO_TASKS = [
  {
    task: "build",
    behaviour:
      "Depends on ^build (upstream first). Outputs dist/** and .next/**.",
  },
  {
    task: "dev",
    behaviour:
      "Depends on ^build (packages compiled), then all dev servers run in parallel. cache: false, persistent: true.",
  },
  {
    task: "start",
    behaviour: "Depends on local build. Production server startup.",
  },
  {
    task: "lint",
    behaviour: "Depends on ^build. Runs lint across all workspaces.",
  },
  {
    task: "typecheck",
    behaviour: "Depends on ^build. Runs tsc --noEmit across all workspaces.",
  },
  { task: "clean", behaviour: "No cache. Deletes build artifacts." },
];
