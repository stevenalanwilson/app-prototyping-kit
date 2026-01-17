# scaffold-resource

Generate a complete CRUD setup for a new resource (API, hooks, pages, routes, navigation).

## Usage

```
/scaffold-resource <ResourceName> [options]
```

## Arguments

- `ResourceName` (required): The name of the resource (e.g., Product, User, Task)
- `--fields` (optional): Comma-separated list of fields in format `name:type` (e.g., `name:string,price:number,active:boolean`)

## Examples

```bash
# Basic resource
/scaffold-resource Product

# Resource with custom fields
/scaffold-resource Product --fields="name:string,price:number,inStock:boolean,category:string"

# Another example
/scaffold-resource Task --fields="title:string,description:string,completed:boolean,dueDate:string"
```

## What This Skill Does

This skill scaffolds a complete CRUD setup following the kit's patterns:

### 1. Type Definition & Mock API (`src/lib/api.ts`)

Adds:
- TypeScript interface for the resource
- Mock data array
- API methods: `list()`, `get()`, `create()`, `update()`, `delete()`

### 2. React Query Hooks (`src/hooks/use[Resource]s.ts`)

Creates:
- `use[Resource]s()` - Query hook for fetching list
- `use[Resource]()` - Query hook for fetching single item
- `useCreate[Resource]()` - Mutation hook for creation
- `useUpdate[Resource]()` - Mutation hook for updates
- `useDelete[Resource]()` - Mutation hook for deletion

### 3. List Page (`src/pages/[Resource]sPage.tsx`)

Generates:
- Page component with list view
- Loading and error states
- Empty state
- Grid/card layout for items
- Delete confirmation modal
- Navigation to create page

### 4. Create Page (`src/pages/Create[Resource]Page.tsx`)

Generates:
- Form with React Hook Form
- Zod validation schema based on fields
- Error handling
- Toast notifications
- Loading states on submit

### 5. Routes (`src/App.tsx`)

Adds routes:
- `/${resource-plural}` → List page
- `/${resource-plural}/new` → Create page

### 6. Navigation (`src/components/layout/Sidebar.tsx`)

Adds sidebar navigation item with icon.

## Implementation Instructions

When this skill is invoked, follow these steps:

### Step 1: Parse Arguments

```typescript
// Extract resource name and fields
const resourceName = args[0] // e.g., "Product"
const resourceNamePlural = pluralize(resourceName) // e.g., "Products"
const resourcePath = resourceName.toLowerCase() // e.g., "product"
const resourcePathPlural = pluralize(resourcePath) // e.g., "products"

// Parse fields from --fields argument
const fieldsArg = getArgValue('--fields')
const fields = fieldsArg ? parseFields(fieldsArg) : getDefaultFields()

// Default fields if none provided:
// name:string, description:string, status:active|inactive
```

### Step 2: Update `src/lib/api.ts`

Add interface and API methods following the pattern from Items:

```typescript
export interface ${ResourceName} {
  id: string
  ${fields.map(f => `${f.name}: ${f.tsType}`).join('\n  ')}
  createdAt: string
}

let mock${ResourceNamePlural}: ${ResourceName}[] = [
  {
    id: '1',
    ${fields.map(f => `${f.name}: ${f.mockValue}`).join(',\n    ')}
    createdAt: new Date().toISOString(),
  },
]

// Add to api object:
${resourcePath}s: {
  list: async (): Promise<${ResourceName}[]> => {
    await delay(500)
    return mock${ResourceNamePlural}
  },

  get: async (id: string): Promise<${ResourceName}> => {
    await delay(300)
    const item = mock${ResourceNamePlural}.find(item => item.id === id)
    if (!item) throw new Error('${ResourceName} not found')
    return item
  },

  create: async (data: Omit<${ResourceName}, 'id' | 'createdAt'>): Promise<${ResourceName}> => {
    await delay(600)
    const new${ResourceName}: ${ResourceName} = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    }
    mock${ResourceNamePlural} = [...mock${ResourceNamePlural}, new${ResourceName}]
    return new${ResourceName}
  },

  update: async (id: string, data: Partial<${ResourceName}>): Promise<${ResourceName}> => {
    await delay(500)
    const index = mock${ResourceNamePlural}.findIndex(item => item.id === id)
    if (index === -1) throw new Error('${ResourceName} not found')
    mock${ResourceNamePlural}[index] = { ...mock${ResourceNamePlural}[index]!, ...data }
    return mock${ResourceNamePlural}[index]!
  },

  delete: async (id: string): Promise<void> => {
    await delay(400)
    mock${ResourceNamePlural} = mock${ResourceNamePlural}.filter(item => item.id !== id)
  },
}
```

### Step 3: Create `src/hooks/use${ResourceNamePlural}.ts`

Follow the pattern from `useItems.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type ${ResourceName} } from '@/lib/api'

const ${resourcePath.toUpperCase()}S_QUERY_KEY = ['${resourcePath}s']

export function use${ResourceNamePlural}() {
  return useQuery({
    queryKey: ${resourcePath.toUpperCase()}S_QUERY_KEY,
    queryFn: api.${resourcePath}s.list,
  })
}

export function use${ResourceName}(id: string) {
  return useQuery({
    queryKey: [...${resourcePath.toUpperCase()}S_QUERY_KEY, id],
    queryFn: () => api.${resourcePath}s.get(id),
    enabled: !!id,
  })
}

export function useCreate${ResourceName}() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.${resourcePath}s.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${resourcePath.toUpperCase()}S_QUERY_KEY })
    },
  })
}

export function useUpdate${ResourceName}() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<${ResourceName}> }) =>
      api.${resourcePath}s.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ${resourcePath.toUpperCase()}S_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...${resourcePath.toUpperCase()}S_QUERY_KEY, variables.id],
      })
    },
  })
}

export function useDelete${ResourceName}() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.${resourcePath}s.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${resourcePath.toUpperCase()}S_QUERY_KEY })
    },
  })
}
```

### Step 4: Create `src/pages/${ResourceNamePlural}Page.tsx`

Generate list page following ItemsPage.tsx pattern.

### Step 5: Create `src/pages/Create${ResourceName}Page.tsx`

Generate form page following CreateItemPage.tsx pattern with Zod schema based on fields.

### Step 6: Update `src/App.tsx`

Add import and routes:

```typescript
import { ${ResourceNamePlural}Page } from '@/pages/${ResourceNamePlural}Page'
import { Create${ResourceName}Page } from '@/pages/Create${ResourceName}Page'

// Add routes inside Layout Route:
<Route path="${resourcePathPlural}" element={<${ResourceNamePlural}Page />} />
<Route path="${resourcePathPlural}/new" element={<Create${ResourceName}Page />} />
```

### Step 7: Update `src/components/layout/Sidebar.tsx`

Add navigation item to `navItems` array with appropriate icon.

## Field Type Mapping

| Input Type | TypeScript Type | Zod Validation | Mock Value |
|------------|----------------|----------------|------------|
| `string` | `string` | `z.string().min(1)` | `'Sample'` |
| `number` | `number` | `z.number().positive()` | `42` |
| `boolean` | `boolean` | `z.boolean()` | `true` |
| `email` | `string` | `z.string().email()` | `'user@example.com'` |
| `url` | `string` | `z.string().url()` | `'https://example.com'` |
| `date` | `string` | `z.string()` | `new Date().toISOString()` |
| Custom enum | `'a' \| 'b'` | `z.enum(['a', 'b'])` | `'a'` |

## Success Response

After successful scaffolding, report:

```
✅ Resource '${ResourceName}' scaffolded successfully!

Created files:
  - src/lib/api.ts (updated)
  - src/hooks/use${ResourceNamePlural}.ts
  - src/pages/${ResourceNamePlural}Page.tsx
  - src/pages/Create${ResourceName}Page.tsx
  - src/App.tsx (updated)
  - src/components/layout/Sidebar.tsx (updated)

Routes added:
  - /${resourcePathPlural} → List view
  - /${resourcePathPlural}/new → Create form

Next steps:
  1. Start dev server: npm run dev
  2. Navigate to /${resourcePathPlural}
  3. Customize validation in Create${ResourceName}Page.tsx
  4. Replace mock API with real endpoints when ready
```

## Error Handling

- Validate resource name is PascalCase
- Check for existing resource to avoid conflicts
- Ensure fields are properly formatted
- Handle file write errors gracefully

## Notes

- Follow exact patterns from Items/useItems/ItemsPage examples
- Maintain TypeScript strict mode compliance
- Include proper error handling and loading states
- Add toast notifications for success/error
- Keep components focused and simple
