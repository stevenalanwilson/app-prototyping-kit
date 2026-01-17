# Quick Start Guide

## Installation

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 5-Minute Tutorial

### 1. Create a New Resource Type

**Define the type and API** (`src/lib/api.ts`):

```typescript
export interface Product {
  id: string
  name: string
  price: number
}

// Add to api object
products: {
  list: async (): Promise<Product[]> => {
    await delay(500)
    return mockProducts
  },
  create: async (data: Omit<Product, 'id'>): Promise<Product> => {
    await delay(600)
    const newProduct = { ...data, id: Math.random().toString(36) }
    mockProducts.push(newProduct)
    return newProduct
  },
}
```

### 2. Create React Query Hooks

**New file** `src/hooks/useProducts.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: api.products.list,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.products.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
```

### 3. Create a Page Component

**New file** `src/pages/ProductsPage.tsx`:

```typescript
import { useProducts } from '@/hooks/useProducts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function ProductsPage() {
  const { data: products, isLoading } = useProducts()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button>Add Product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${product.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### 4. Add Route

**Edit** `src/App.tsx`:

```typescript
import { ProductsPage } from '@/pages/ProductsPage'

// In Routes component:
<Route path="/products" element={<ProductsPage />} />
```

### 5. Add Navigation

**Edit** `src/components/layout/Sidebar.tsx`:

```typescript
// Add to navItems array:
{
  to: '/products',
  label: 'Products',
  icon: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
}
```

**Done!** You now have a working page with data fetching.

## Common Tasks

### Add a Form with Validation

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
})

type FormData = z.infer<typeof schema>

function ProductForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const createProduct = useCreateProduct()

  const onSubmit = async (data: FormData) => {
    await createProduct.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Price"
        type="number"
        error={errors.price?.message}
        {...register('price', { valueAsNumber: true })}
      />
      <Button type="submit" isLoading={createProduct.isPending}>
        Create
      </Button>
    </form>
  )
}
```

### Show Toast Notifications

```typescript
import { useToast } from '@/components/ui/Toast'

function MyComponent() {
  const { toast } = useToast()

  const handleAction = () => {
    toast({
      title: 'Success!',
      description: 'Your action completed',
      variant: 'success', // or 'error', 'warning', 'default'
    })
  }

  return <Button onClick={handleAction}>Do Something</Button>
}
```

### Open a Modal

```typescript
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Confirm Action"
        description="Are you sure you want to do this?"
      >
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  )
}
```

### Add Client State

```typescript
// Create store: src/stores/cartStore.ts
import { create } from 'zustand'

interface CartState {
  items: string[]
  addItem: (item: string) => void
  removeItem: (item: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  removeItem: (item) => set((state) => ({
    items: state.items.filter(i => i !== item)
  })),
  clearCart: () => set({ items: [] }),
}))

// Use in component:
function Cart() {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)

  return (
    <div>
      <p>Items: {items.length}</p>
      <Button onClick={() => addItem('Product 1')}>Add Item</Button>
    </div>
  )
}
```

### Make API Call with Error Handling

```typescript
function MyComponent() {
  const { data, error, isLoading } = useProducts()
  const { toast } = useToast()

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-900">Error: {error.message}</p>
        <Button
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    )
  }

  return <div>{/* Render data */}</div>
}
```

## Available Components

### Buttons

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

<Button isLoading>Loading...</Button>
<Button disabled>Disabled</Button>
```

### Inputs

```tsx
<Input
  label="Name"
  placeholder="Enter name"
  error="This field is required"
  helperText="Choose a unique name"
/>
```

### Select

```tsx
<Select
  label="Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
  value={value}
  onValueChange={setValue}
  error="Please select a status"
/>
```

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Lint code
npm run lint:fix         # Fix lint errors
npm run typecheck        # Check TypeScript types
npm run format           # Format code with Prettier
npm run format:check     # Check formatting

# Testing
npm test                 # Run tests in watch mode
npm run test:ui          # Run tests with UI
```

## Keyboard Shortcuts (VS Code)

- `Cmd/Ctrl + P` - Quick file open
- `Cmd/Ctrl + Shift + F` - Search across files
- `F2` - Rename symbol
- `Cmd/Ctrl + .` - Quick fix
- `Cmd/Ctrl + Shift + P` - Command palette

## Next Steps

1. Check out `README.md` for full documentation
2. Read `DEVELOPMENT.md` for patterns and best practices
3. Explore the example pages in `src/pages/`
4. Customize Tailwind theme in `tailwind.config.js`
5. Replace mock API with real endpoints in `src/lib/api.ts`

## Getting Help

- Check TypeScript errors: `npm run typecheck`
- Check console for runtime errors
- Use React DevTools browser extension
- Add `console.log()` or debugger statements
- Review example code in existing pages
