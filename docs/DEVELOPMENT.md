# Development Guide

## Architecture Decisions

### Why These Libraries?

**React Query (TanStack Query)**
- Eliminates boilerplate for data fetching
- Automatic caching and background refetching
- Optimistic updates out of the box
- Perfect for prototyping where you want to iterate quickly

**Zustand over Redux**
- Minimal boilerplate (no actions, reducers, providers)
- TypeScript-first design
- ~1KB bundle size
- Use for transient UI state only (sidebar open/closed, modal state, etc.)

**React Hook Form + Zod**
- Minimal re-renders (uncontrolled forms)
- Type-safe validation schemas
- Easy integration with UI libraries
- Runtime validation with TypeScript inference

**Radix UI**
- Unstyled, accessible primitives
- Full keyboard navigation support
- ARIA attributes handled automatically
- Style with Tailwind as needed

### File Organization

```
src/
├── components/
│   ├── layout/           # App shell (Header, Sidebar, Layout)
│   └── ui/               # Reusable primitives
├── pages/                # Route handlers (one per route)
├── hooks/                # Custom hooks (data fetching, etc.)
├── lib/                  # Non-React code
│   ├── api.ts           # API client
│   ├── queryClient.ts   # Query config
│   └── utils.ts         # Pure functions
├── stores/               # Client state (Zustand)
├── types/                # Shared types
└── test/                 # Test setup and utilities
```

**Principles:**
- Co-locate when possible (tests next to components)
- Separate UI from logic (custom hooks)
- Keep pages thin (delegate to components and hooks)

## Common Patterns

### Data Fetching Pattern

**1. Define API methods** (`src/lib/api.ts`):

```tsx
export const api = {
  items: {
    list: async (): Promise<Item[]> => {
      const response = await fetch('/api/items')
      if (!response.ok) throw new Error('Failed to fetch')
      return response.json()
    },
  }
}
```

**2. Create custom hooks** (`src/hooks/useItems.ts`):

```tsx
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: api.items.list,
  })
}

export function useCreateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.items.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })
}
```

**3. Use in components**:

```tsx
function ItemsList() {
  const { data: items, isLoading } = useItems()
  const createItem = useCreateItem()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {items?.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

### Form Pattern

**1. Define schema**:

```tsx
const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
})

type FormData = z.infer<typeof formSchema>
```

**2. Setup form**:

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: '',
    email: '',
    age: 18,
  }
})
```

**3. Handle submission**:

```tsx
const createMutation = useCreateItem()

const onSubmit = async (data: FormData) => {
  try {
    await createMutation.mutateAsync(data)
    toast({ title: 'Success', variant: 'success' })
    navigate('/items')
  } catch (error) {
    toast({ title: 'Error', variant: 'error' })
  }
}
```

**4. Render form**:

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  <Input
    label="Name"
    error={errors.name?.message}
    {...register('name')}
  />
  <Input
    label="Email"
    type="email"
    error={errors.email?.message}
    {...register('email')}
  />
  <Button type="submit" isLoading={createMutation.isPending}>
    Submit
  </Button>
</form>
```

### Component Composition Pattern

Break large components into smaller, focused pieces:

```tsx
// ❌ Avoid: Large, monolithic component
function ItemPage() {
  return (
    <div>
      {/* 500 lines of JSX */}
    </div>
  )
}

// ✅ Better: Composed from smaller components
function ItemPage() {
  return (
    <div>
      <ItemHeader />
      <ItemContent />
      <ItemActions />
    </div>
  )
}
```

### Error Handling Pattern

**API Errors:**

```tsx
// In custom hook
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: api.items.list,
    retry: 1,
    throwOnError: true, // Let error boundary catch
  })
}

// In component
const { data, error } = useItems()

if (error) {
  return <div>Error: {error.message}</div>
}
```

**Form Errors:**

```tsx
// Validation errors handled by Zod
const schema = z.object({
  email: z.string().email('Invalid email'),
})

// Runtime errors in submission
const onSubmit = async (data: FormData) => {
  try {
    await createMutation.mutateAsync(data)
  } catch (error) {
    if (error instanceof ValidationError) {
      // Handle specific error types
    }
    toast({ title: 'Error', variant: 'error' })
  }
}
```

## Performance Tips

### Avoid Unnecessary Re-renders

```tsx
// ✅ Select only what you need from Zustand
const sidebarOpen = useUIStore(state => state.sidebarOpen)

// ❌ Avoid selecting entire store
const store = useUIStore()
```

### Lazy Load Routes

```tsx
import { lazy, Suspense } from 'react'

const ItemsPage = lazy(() => import('./pages/ItemsPage'))

<Route
  path="/items"
  element={
    <Suspense fallback={<div>Loading...</div>}>
      <ItemsPage />
    </Suspense>
  }
/>
```

### Optimize TanStack Query

```tsx
// Good defaults in queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})
```

## Testing Strategy

### Unit Tests

Test individual components and functions:

```tsx
// Button.test.tsx
describe('Button', () => {
  it('handles clicks', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

### Integration Tests

Test page components with real hooks:

```tsx
// ItemsPage.test.tsx
describe('ItemsPage', () => {
  it('displays items', async () => {
    renderWithProviders(<ItemsPage />)

    await waitFor(() => {
      expect(screen.getByText('First Item')).toBeInTheDocument()
    })
  })
})
```

### What to Test

**✅ Test:**
- User interactions (clicks, form submissions)
- Conditional rendering (loading, error, success states)
- Form validation
- Navigation flows

**❌ Don't test:**
- Implementation details (state, hooks)
- Third-party libraries (React Query, Radix UI)
- Styles and CSS classes (unless critical to functionality)

## Styling Guidelines

### Tailwind Utilities

```tsx
// Consistent spacing
<div className="space-y-4">        {/* Gap between children */}
<div className="p-6">              {/* Padding */}
<div className="mt-4">             {/* Margin top */}

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Interactive states
<button className="hover:bg-gray-100 focus:ring-2 focus:ring-primary-500">
```

### Component Variants

Use object mapping for variants:

```tsx
const variants = {
  primary: 'bg-primary-600 text-white',
  secondary: 'bg-gray-200 text-gray-900',
}

<button className={variants[variant]} />
```

### Custom Utilities

For repeated patterns, use the `cn()` utility:

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class',
  condition && 'conditional-class',
  className // Allow override
)} />
```

## Debugging Tips

### React Query DevTools

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Zustand DevTools

```tsx
import { devtools } from 'zustand/middleware'

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // store implementation
    }),
    { name: 'UIStore' }
  )
)
```

### TypeScript Errors

```bash
# Run type checking separately
npm run typecheck

# Common fixes:
# 1. Add non-null assertion when you know value exists
const item = items[0]!

# 2. Use optional chaining
const name = user?.profile?.name

# 3. Type guard for arrays
if (items && items.length > 0) {
  const first = items[0] // TypeScript knows this exists
}
```

## Migration to Production

### Environment Variables

```bash
# .env.local
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My App
```

```tsx
// Usage
const apiUrl = import.meta.env.VITE_API_URL
```

### Replace Mock API

```tsx
// Before (mock)
export const api = {
  items: {
    list: async () => mockItems,
  }
}

// After (real)
export const api = {
  items: {
    list: async () => {
      const response = await fetch(`${API_URL}/items`)
      return response.json()
    },
  }
}
```

### Add Authentication

```tsx
// Create auth hook
export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => fetch('/api/auth/me').then(r => r.json()),
  })
}

// Protect routes
function ProtectedRoute({ children }) {
  const { data: user, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />

  return children
}
```

### Add Error Boundary

```tsx
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary
  fallback={<div>Something went wrong</div>}
  onError={(error) => logErrorToService(error)}
>
  <App />
</ErrorBoundary>
```

## Common Issues

### Module Resolution

If `@/` imports don't work:
1. Check `tsconfig.json` has correct `paths`
2. Check `vite.config.ts` has `resolve.alias`
3. Restart TypeScript server in VS Code

### Tailwind Classes Not Applied

1. Check file is in `tailwind.config.js` content array
2. Check `index.css` imports Tailwind directives
3. Restart dev server

### Type Errors with React Query

```tsx
// Specify generic types explicitly
const { data } = useQuery<Item[]>({
  queryKey: ['items'],
  queryFn: api.items.list,
})
```
