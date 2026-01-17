# App Prototyping Kit

A minimal, production-realistic frontend codebase optimized for rapid prototyping of web applications.

## 📚 Documentation

**[→ Full Documentation Index](docs/INDEX.md)** - Complete navigation guide

### Getting Started
- **[Start Here](docs/START_HERE.md)** - Documentation map and quick navigation
- **[Get Started](docs/GET_STARTED.md)** - 3-step tutorial to build your first feature
- **[Quick Start](docs/QUICK_START.md)** - Common tasks and code recipes

### Guides & Reference
- **[Development Guide](docs/DEVELOPMENT.md)** - Architecture patterns and best practices
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - File organization and conventions
- **[Checklists](docs/CHECKLIST.md)** - Step-by-step guides for common tasks
- **[Summary](docs/SUMMARY.md)** - Comprehensive overview
- **[File Tree](docs/TREE.txt)** - Visual project structure

## ⚡ Claude Skills (AI-Powered Acceleration)

This kit includes Claude Skills that automate repetitive tasks:

- **`/scaffold-resource`** - Generate complete CRUD setup (API, hooks, pages, routes) in seconds
- **`/generate-component`** - Create UI components with variants and tests
- **`/build-form`** - Build validated forms with React Hook Form + Zod

**Documentation:**
- **[Skills Guide](docs/SKILLS_GUIDE.md)** - Complete usage guide
- **[Examples](docs/EXAMPLES.md)** - Real-world use cases and workflows
- **[Quick Reference](docs/QUICK_REFERENCE.txt)** - Printable cheat sheet
- **[Implementation Summary](docs/PHASE1_COMPLETE.md)** - Phase 1 details

## Tech Stack

- **React 18** - Function components and hooks
- **TypeScript** - Strict type checking for reliability
- **Vite** - Lightning-fast dev server and build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Simple client state management
- **React Hook Form + Zod** - Type-safe forms with validation
- **Radix UI** - Accessible headless UI primitives
- **Vitest + Testing Library** - Fast, modern testing

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (opens on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Type check
npm run typecheck

# Lint
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar, Layout)
│   └── ui/             # Base UI components (Button, Input, Card, etc.)
├── pages/              # Page components (route handlers)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and shared logic
│   ├── api.ts          # API client (mock for prototyping)
│   ├── queryClient.ts  # TanStack Query configuration
│   └── utils.ts        # Helper functions
├── stores/             # Zustand stores for client state
├── styles/             # Global styles and Tailwind imports
├── test/               # Test utilities and setup
└── types/              # Shared TypeScript types
```

## Key Features

### 🎨 Component Library

Pre-built, accessible components using Radix UI primitives:
- `Button` - Multiple variants (primary, secondary, ghost, danger)
- `Input` - With label, error states, and helper text
- `Select` - Accessible dropdown with keyboard navigation
- `Card` - Flexible container with header, content, footer
- `Modal` - Dialog with overlay and animations
- `Toast` - Notification system with variants

### 📋 Forms & Validation

Type-safe forms with React Hook Form + Zod:

```tsx
const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
})

type FormData = z.infer<typeof schema>

const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema)
})
```

See `src/pages/CreateItemPage.tsx` for a complete example.

### 🔄 Data Fetching

TanStack Query hooks for server state:

```tsx
// Custom hook pattern
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: api.items.list,
  })
}

// Usage in components
const { data, isLoading } = useItems()
```

See `src/hooks/useItems.ts` for mutation examples.

### 💾 Client State

Simple Zustand store for UI state:

```tsx
const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen
  })),
}))

// Usage
const toggleSidebar = useUIStore((state) => state.toggleSidebar)
```

## Adding New Features

### Add a New Page

1. Create page component in `src/pages/`:

```tsx
// src/pages/MyNewPage.tsx
export function MyNewPage() {
  return <div>My New Page</div>
}
```

2. Add route in `src/App.tsx`:

```tsx
<Route path="/my-page" element={<MyNewPage />} />
```

3. Add navigation link in `src/components/layout/Sidebar.tsx`

### Add a New API Resource

1. Define types and API methods in `src/lib/api.ts`:

```tsx
export interface MyResource {
  id: string
  name: string
}

export const api = {
  myResource: {
    list: async (): Promise<MyResource[]> => { /* ... */ },
    create: async (data: Omit<MyResource, 'id'>): Promise<MyResource> => { /* ... */ },
  }
}
```

2. Create custom hooks in `src/hooks/`:

```tsx
// src/hooks/useMyResource.ts
export function useMyResources() {
  return useQuery({
    queryKey: ['myResources'],
    queryFn: api.myResource.list,
  })
}

export function useCreateMyResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.myResource.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myResources'] })
    },
  })
}
```

3. Use in components:

```tsx
const { data } = useMyResources()
const createResource = useCreateMyResource()
```

### Add a New Form

1. Define Zod schema:

```tsx
const myFormSchema = z.object({
  field1: z.string().min(1),
  field2: z.number().positive(),
})

type MyFormData = z.infer<typeof myFormSchema>
```

2. Setup form with React Hook Form:

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<MyFormData>({
  resolver: zodResolver(myFormSchema)
})

const onSubmit = (data: MyFormData) => {
  // Handle submission
}
```

3. Render with UI components:

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  <Input
    label="Field 1"
    error={errors.field1?.message}
    {...register('field1')}
  />
  <Button type="submit">Submit</Button>
</form>
```

## Testing

Write tests using Vitest and Testing Library:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

For components using React Query or Router, use the test utilities:

```tsx
import { renderWithProviders } from '@/test/utils'

renderWithProviders(<MyComponent />)
```

## Customization

### Tailwind Theme

Modify `tailwind.config.js` to customize colors, fonts, spacing:

```js
theme: {
  extend: {
    colors: {
      primary: { /* your brand colors */ },
    },
  },
}
```

### API Integration

Replace the mock API in `src/lib/api.ts` with real API calls:

```tsx
export const api = {
  items: {
    list: async () => {
      const response = await fetch('/api/items')
      return response.json()
    },
  }
}
```

Consider adding environment variables for API URLs:

```tsx
const API_URL = import.meta.env.VITE_API_URL
```

## Best Practices

1. **Keep components focused** - Single responsibility principle
2. **Use custom hooks** - Extract complex logic from components
3. **Type everything** - Leverage TypeScript for reliability
4. **Validate at boundaries** - Use Zod schemas for forms and API responses
5. **Test critical paths** - Focus on user flows, not implementation details
6. **Optimize for change** - Prefer composition over premature abstraction

## Learn More

For detailed guides and examples:
- **New to this kit?** → [Get Started Guide](docs/GET_STARTED.md)
- **Need code examples?** → [Quick Start](docs/QUICK_START.md)
- **Want to understand patterns?** → [Development Guide](docs/DEVELOPMENT.md)
- **Looking for step-by-step guides?** → [Checklists](docs/CHECKLIST.md)

## License

MIT
