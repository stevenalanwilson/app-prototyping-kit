# Project Structure

```
app-prototyping-kit/
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Top navigation bar with menu toggle
│   │   │   ├── Sidebar.tsx      # Side navigation with route links
│   │   │   └── Layout.tsx       # Main layout wrapper with Outlet
│   │   └── ui/
│   │       ├── Button.tsx       # Button component with variants
│   │       ├── Button.test.tsx  # Button component tests
│   │       ├── Card.tsx         # Card container with subcomponents
│   │       ├── Input.tsx        # Text input with label and error
│   │       ├── Select.tsx       # Dropdown select (Radix UI)
│   │       ├── Modal.tsx        # Dialog modal (Radix UI)
│   │       └── Toast.tsx        # Toast notification system (Radix UI)
│   ├── hooks/
│   │   └── useItems.ts          # React Query hooks for items resource
│   ├── lib/
│   │   ├── api.ts               # API client (mock for prototyping)
│   │   ├── queryClient.ts       # TanStack Query configuration
│   │   └── utils.ts             # Utility functions (cn, formatDate, etc.)
│   ├── pages/
│   │   ├── HomePage.tsx         # Landing page with feature cards
│   │   ├── ItemsPage.tsx        # List view with CRUD operations
│   │   ├── CreateItemPage.tsx   # Form page with validation
│   │   └── SettingsPage.tsx     # Settings/preferences page
│   ├── stores/
│   │   └── uiStore.ts           # Zustand store for UI state
│   ├── styles/
│   │   └── index.css            # Global styles + Tailwind imports
│   ├── test/
│   │   ├── setup.ts             # Vitest + Testing Library setup
│   │   └── utils.tsx            # Test utilities (renderWithProviders)
│   ├── types/
│   │   └── index.ts             # Shared TypeScript types
│   ├── App.tsx                  # Root component with routes
│   └── main.tsx                 # App entry point
├── .eslintrc.cjs                # ESLint configuration
├── .gitignore                   # Git ignore patterns
├── .prettierrc.json             # Prettier formatting config
├── .env.example                 # Environment variables template
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.node.json           # TypeScript config for Vite
├── vite.config.ts               # Vite configuration
├── README.md                    # Main documentation
├── DEVELOPMENT.md               # Development guide
├── QUICK_START.md               # Quick reference guide
└── PROJECT_STRUCTURE.md         # This file
```

## Directory Purposes

### `/src/components/layout/`
Layout components that define the app shell structure. These wrap around page content and provide consistent navigation.

**When to add here:**
- Global navigation components
- App shell elements (header, footer, sidebar)
- Layout wrappers that appear on multiple routes

### `/src/components/ui/`
Reusable, generic UI components. These are the building blocks used throughout the app.

**When to add here:**
- Buttons, inputs, and form controls
- Cards, modals, and containers
- Any component used in 3+ places
- Wrapper components for third-party UI libraries (Radix)

### `/src/pages/`
Route handler components. Each file represents a distinct URL route in your app.

**When to add here:**
- One component per route
- Page-level components that compose smaller UI components
- Route-specific logic and data fetching

**Naming convention:** `[Feature]Page.tsx` (e.g., `ProductsPage.tsx`)

### `/src/hooks/`
Custom React hooks for reusable logic, especially data fetching.

**When to add here:**
- React Query hooks (useItems, useProducts, etc.)
- Shared stateful logic that multiple components use
- Complex hooks that abstract away implementation details

**Naming convention:** `use[Resource].ts` (e.g., `useProducts.ts`)

### `/src/lib/`
Non-React code. Pure functions and utilities that don't use hooks or components.

**When to add here:**
- API client functions
- Utility functions (formatting, validation, etc.)
- Configuration objects (query client, axios instance, etc.)
- Helper functions that work outside React

### `/src/stores/`
Zustand stores for client-side state management.

**When to add here:**
- UI state (sidebar open, theme, etc.)
- Client-side app state that doesn't come from the server
- State that multiple components need to access

**When NOT to use:**
- Server state (use React Query instead)
- Form state (use React Hook Form instead)
- State that only one component needs (use useState)

### `/src/types/`
Shared TypeScript type definitions.

**When to add here:**
- Types used across multiple files
- Complex type definitions
- Re-exported types from API/lib files

**When NOT to use:**
- Types only used in one file (define them in that file)
- Types that can be inferred

### `/src/test/`
Testing utilities and configuration.

**When to add here:**
- Test setup files
- Custom render functions
- Mock data factories
- Test utilities used across multiple test files

## File Naming Conventions

- **Components:** PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Hooks:** camelCase with `use` prefix (`useItems.ts`, `useAuth.ts`)
- **Utilities:** camelCase (`utils.ts`, `api.ts`, `formatters.ts`)
- **Types:** PascalCase (`types.ts`, `models.ts`)
- **Tests:** Same as source file with `.test` suffix (`Button.test.tsx`)

## Import Aliases

The project uses `@/` as an alias for the `src/` directory:

```typescript
// ✅ Use alias
import { Button } from '@/components/ui/Button'
import { useItems } from '@/hooks/useItems'

// ❌ Avoid relative paths when possible
import { Button } from '../../../components/ui/Button'
```

## Adding New Features

### New Resource/Entity

When adding a new resource (e.g., "Products"):

1. **Add type** → `src/lib/api.ts` (interface Product)
2. **Add API methods** → `src/lib/api.ts` (api.products.list, etc.)
3. **Create hooks** → `src/hooks/useProducts.ts`
4. **Create page(s)** → `src/pages/ProductsPage.tsx`, `src/pages/CreateProductPage.tsx`
5. **Add routes** → `src/App.tsx`
6. **Add navigation** → `src/components/layout/Sidebar.tsx`

### New Reusable Component

1. Create in `src/components/ui/ComponentName.tsx`
2. Export from component file
3. (Optional) Add tests in `src/components/ui/ComponentName.test.tsx`
4. Use throughout app via `import { ComponentName } from '@/components/ui/ComponentName'`

### New Page

1. Create in `src/pages/PageName.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Sidebar.tsx` (if needed)

## Dependency Graph

```
main.tsx
  └─ App.tsx
      ├─ Layout.tsx
      │   ├─ Header.tsx
      │   ├─ Sidebar.tsx
      │   └─ [Page Components]
      │       ├─ UI Components (Button, Card, etc.)
      │       ├─ Custom Hooks (useItems, etc.)
      │       │   └─ API Client (api.ts)
      │       └─ Stores (uiStore.ts)
      └─ ToastProvider
```

## State Management Overview

```
┌─────────────────────────────────────────┐
│         Application State               │
├─────────────────────────────────────────┤
│                                         │
│  Server State (React Query)             │
│  - Items, products, users, etc.         │
│  - Cached, auto-refetched               │
│  - Located in: hooks/                   │
│                                         │
│  Client State (Zustand)                 │
│  - UI state (sidebar open, theme)       │
│  - Located in: stores/                  │
│                                         │
│  Form State (React Hook Form)           │
│  - Temporary input values               │
│  - Validation state                     │
│  - Located in: page components          │
│                                         │
│  Local State (useState)                 │
│  - Component-specific state             │
│  - Modal open/close                     │
│  - Located in: individual components    │
│                                         │
└─────────────────────────────────────────┘
```

## Styling Architecture

```
Global Styles (styles/index.css)
  └─ Tailwind base, components, utilities

Tailwind Config (tailwind.config.js)
  └─ Theme customization (colors, fonts, etc.)

Component Styles
  └─ Inline Tailwind utility classes
  └─ Variant objects for conditional styles
```

## Data Flow

```
User Action
  ↓
Component Event Handler
  ↓
Custom Hook (React Query)
  ↓
API Client (lib/api.ts)
  ↓
Backend API (or mock)
  ↓
React Query Cache
  ↓
Component Re-render
  ↓
UI Update
```
