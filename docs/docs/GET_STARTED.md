# 🚀 Get Started in 3 Steps

## Step 1: Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Your browser will automatically open to http://localhost:3000

You should see the **App Prototyping Kit** homepage with:
- Welcome message
- Feature cards showcasing the kit
- Working navigation in the sidebar

## Step 2: Explore the Examples (5 minutes)

Click through the sidebar navigation:

### 🏠 Home Page
- Shows kit features and tech stack
- Demonstrates Card components and layout

### 📦 Items Page
Shows a complete CRUD example:
- List of items (TanStack Query data fetching)
- Create button → goes to form page
- Delete button → opens confirmation modal
- Real-time updates after mutations

### ➕ Create Item (via Items page)
Shows form validation:
- React Hook Form setup
- Zod schema validation
- Error messages
- Loading states
- Success/error toast notifications

### ⚙️ Settings Page
Shows additional UI patterns:
- Form inputs
- Action buttons
- Card layouts

## Step 3: Build Your First Feature (15 minutes)

Let's add a "Products" resource to understand the patterns.

### A. Define the Data Model

Open `src/lib/api.ts` and add:

```typescript
// 1. Define the interface
export interface Product {
  id: string
  name: string
  price: number
  inStock: boolean
  createdAt: string
}

// 2. Add mock data
let mockProducts: Product[] = [
  {
    id: '1',
    name: 'Widget',
    price: 29.99,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
]

// 3. Add API methods (add to existing api object)
export const api = {
  // ... existing items methods ...

  products: {
    list: async (): Promise<Product[]> => {
      await delay(500)
      return mockProducts
    },

    create: async (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
      await delay(600)
      const newProduct: Product = {
        ...data,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
      }
      mockProducts = [...mockProducts, newProduct]
      return newProduct
    },
  },
}
```

### B. Create React Query Hooks

Create new file `src/hooks/useProducts.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Product } from '@/lib/api'

const PRODUCTS_QUERY_KEY = ['products']

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: api.products.list,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.products.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
  })
}
```

### C. Create the Page Component

Create new file `src/pages/ProductsPage.tsx`:

```typescript
import { useProducts } from '@/hooks/useProducts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function ProductsPage() {
  const { data: products, isLoading } = useProducts()

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">
      <div className="text-gray-500">Loading products...</div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">Your product catalog</p>
        </div>
        <Button>Add Product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {product.inStock ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### D. Add the Route

Open `src/App.tsx` and add:

```typescript
// 1. Import the page
import { ProductsPage } from '@/pages/ProductsPage'

// 2. Add the route (inside the Layout Route)
<Route path="/products" element={<ProductsPage />} />
```

### E. Add Navigation Link

Open `src/components/layout/Sidebar.tsx` and add to `navItems`:

```typescript
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

### F. Test It!

1. Save all files
2. Click "Products" in the sidebar
3. You should see your product list!

**🎉 You just added a complete new feature!**

---

## What You Just Learned

✅ **Data modeling** - Define types and mock API
✅ **Data fetching** - React Query hooks pattern
✅ **Page creation** - Build route handler components
✅ **Routing** - Add routes to the app
✅ **Navigation** - Update sidebar links

## Next Steps

### Level Up: Add a Form

Add a create product form using the same pattern as `CreateItemPage.tsx`:

1. Define Zod schema for validation
2. Use React Hook Form
3. Use `useCreateProduct()` mutation
4. Show success toast

Full example in `src/pages/CreateItemPage.tsx`

### Go Further

- **Add real API**: Replace mock functions in `src/lib/api.ts`
- **Add authentication**: See patterns in `DEVELOPMENT.md`
- **Customize design**: Update `tailwind.config.js`
- **Add tests**: Follow `Button.test.tsx` example
- **Deploy**: Use Vercel/Netlify (auto-detects Vite)

## Documentation Quick Reference

| Document | Purpose | Read When |
|----------|---------|-----------|
| `README.md` | Feature overview & setup | First time setup |
| `QUICK_START.md` | Common tasks & snippets | Building features |
| `DEVELOPMENT.md` | Patterns & architecture | Learning best practices |
| `PROJECT_STRUCTURE.md` | File organization | Deciding where to put code |
| `CHECKLIST.md` | Step-by-step guides | Before commits/deploys |
| `TREE.txt` | Visual structure | Understanding layout |

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build locally

# Code Quality
npm run lint         # Check linting
npm run typecheck    # Check types
npm run format       # Format code

# Testing
npm test             # Run tests
npm run test:ui      # Tests with UI
```

## Getting Help

### TypeScript Errors?
Run `npm run typecheck` to see all errors at once.

### Styling Not Working?
1. Check file is in `tailwind.config.js` content array
2. Restart dev server
3. Check browser console for errors

### Import Errors?
Make sure you're using the `@/` alias:
```typescript
import { Button } from '@/components/ui/Button'  // ✅
import { Button } from '../components/ui/Button'  // ❌
```

### Need Inspiration?
Look at existing pages:
- `ItemsPage.tsx` - List with delete
- `CreateItemPage.tsx` - Form with validation
- `HomePage.tsx` - Layout examples

## You're Ready! 🎯

You now have everything you need to build your MVP:
- ✅ Working codebase
- ✅ Example patterns to follow
- ✅ Full documentation
- ✅ Development tools configured

**Start building something awesome!** 🚀
