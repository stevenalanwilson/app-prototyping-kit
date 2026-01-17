# build-form

Generate a validated form component with React Hook Form + Zod following the kit's patterns.

## Usage

```
/build-form <FormName> --fields="<field-definitions>" [options]
```

## Arguments

- `FormName` (required): The name of the form (e.g., UserProfile, CreateProduct, UpdateSettings)
- `--fields` (required): Field definitions in format `name:type:validation`
- `--mutation` (optional): The mutation hook to use (e.g., `useCreateProduct`)
- `--on-success` (optional): Path to redirect on success (e.g., `/products`)
- `--inline` (optional): Generate inline form (not a full page)

## Field Definition Format

```
name:type[:validation]
```

**Types:**
- `string` - Text input
- `email` - Email input
- `number` - Number input
- `boolean` - Checkbox
- `select` - Dropdown select
- `textarea` - Multi-line text
- `date` - Date input
- `url` - URL input

**Validation (optional):**
- `min(n)` - Minimum length/value
- `max(n)` - Maximum length/value
- `required` - Required field (default for all)
- `optional` - Optional field
- `enum(a,b,c)` - Select options

## Examples

```bash
# User profile form
/build-form UserProfile --fields="name:string:min(3),email:email,bio:textarea:max(500):optional"

# Product creation form
/build-form CreateProduct --fields="name:string:min(3):max(50),price:number:min(0),category:select:enum(electronics,clothing,food),inStock:boolean" --mutation="useCreateProduct" --on-success="/products"

# Settings form (inline)
/build-form SettingsForm --fields="notifications:boolean,theme:select:enum(light,dark)" --inline

# Task form with date
/build-form CreateTask --fields="title:string:min(3),description:textarea:optional,dueDate:date,priority:select:enum(low,medium,high)"
```

## What This Skill Does

This skill generates a complete form implementation following CreateItemPage.tsx pattern:

### 1. Form Component (File or Inline)

Creates:
- Zod schema with proper validation
- TypeScript type inferred from schema
- React Hook Form setup with zodResolver
- Form fields using UI components
- Submit handler with mutation
- Error handling and toast notifications
- Loading states

### 2. Form UI

Includes:
- Proper label associations
- Error message display
- Helper text (if specified)
- Submit button with loading state
- Cancel button (for page forms)
- Responsive layout

### 3. Integration

Sets up:
- Mutation hook integration
- Success/error toasts
- Navigation on success (if page)
- Form reset after success (if inline)

## Implementation Instructions

When this skill is invoked, follow these steps:

### Step 1: Parse Field Definitions

```typescript
const formName = args[0] // e.g., "CreateProduct"
const fieldsArg = getArgValue('--fields')
const mutationHook = getArgValue('--mutation')
const onSuccessPath = getArgValue('--on-success')
const isInline = hasFlag('--inline')

// Parse fields
const fields = parseFields(fieldsArg)
// Example: [
//   { name: 'name', type: 'string', validations: ['min(3)', 'max(50)'] },
//   { name: 'price', type: 'number', validations: ['min(0)'] },
//   { name: 'category', type: 'select', validations: ['enum(electronics,clothing)'] }
// ]
```

### Step 2: Generate Zod Schema

```typescript
import { z } from 'zod'

const ${formName.replace(/Form$/, '')}Schema = z.object({
  ${fields.map(field => generateZodField(field)).join(',\n  ')}
})

type ${formName}Data = z.infer<typeof ${formName.replace(/Form$/, '')}Schema>
```

**Zod Field Generation Examples:**

```typescript
// string with min/max
name: z.string()
  .min(3, 'Name must be at least 3 characters')
  .max(50, 'Name must be less than 50 characters')

// email
email: z.string().email('Invalid email address')

// number with min
price: z.number()
  .positive('Price must be positive')
  .min(0, 'Price must be at least 0')

// boolean
inStock: z.boolean()

// select with enum
category: z.enum(['electronics', 'clothing', 'food'], {
  required_error: 'Please select a category',
})

// optional textarea
bio: z.string()
  .max(500, 'Bio must be less than 500 characters')
  .optional()

// date
dueDate: z.string() // Store as ISO string

// url
website: z.string().url('Invalid URL')
```

### Step 3: Generate Form Component

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ${mutationHook || 'useMutation'} } from '@/hooks/...'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'
${onSuccessPath ? "import { useNavigate } from 'react-router-dom'" : ''}

// Schema here...

export function ${formName}(${isInline ? '{ onSuccess }: { onSuccess?: () => void }' : ''}) {
  ${onSuccessPath ? 'const navigate = useNavigate()' : ''}
  const { toast } = useToast()
  const ${mutationHook ? `mutation = ${mutationHook}()` : ''}

  const {
    register,
    handleSubmit,
    formState: { errors },
    ${hasSelectFields(fields) ? 'setValue,\n    watch,' : ''}
    ${isInline ? 'reset,' : ''}
  } = useForm<${formName}Data>({
    resolver: zodResolver(${formName.replace(/Form$/, '')}Schema),
    defaultValues: {
      ${fields.map(f => `${f.name}: ${getDefaultValue(f)}`).join(',\n      ')}
    },
  })

  const onSubmit = async (data: ${formName}Data) => {
    try {
      ${mutationHook ? `await mutation.mutateAsync(data)` : '// Handle submission'}
      toast({
        title: 'Success',
        description: '${formName.replace(/^Create|^Update/, '')} ${mutationHook?.includes('Create') ? 'created' : 'updated'} successfully',
        variant: 'success',
      })
      ${onSuccessPath ? `navigate('${onSuccessPath}')` : ''}
      ${isInline ? 'reset()\n      onSuccess?.()' : ''}
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to ${mutationHook?.includes('Create') ? 'create' : 'update'} ${formName.replace(/^Create|^Update/, '').toLowerCase()}',
        variant: 'error',
      })
    }
  }

  ${hasSelectFields(fields) ? generateWatchStatements(fields) : ''}

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      ${fields.map(field => generateFormField(field)).join('\n\n      ')}

      <div className="flex justify-end gap-3 pt-4">
        ${!isInline ? `
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>` : ''}
        <Button type="submit" isLoading={${mutationHook ? 'mutation.isPending' : 'false'}}>
          ${formName.includes('Create') ? 'Create' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
```

### Step 4: Generate Form Fields

For each field type, generate appropriate JSX:

**String/Email/URL Input:**
```tsx
<Input
  label="${capitalize(field.name)}"
  type="${field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}"
  placeholder="Enter ${field.name}"
  error={errors.${field.name}?.message}
  {...register('${field.name}')}
/>
```

**Number Input:**
```tsx
<Input
  label="${capitalize(field.name)}"
  type="number"
  placeholder="Enter ${field.name}"
  error={errors.${field.name}?.message}
  {...register('${field.name}', { valueAsNumber: true })}
/>
```

**Textarea:**
```tsx
<div>
  <label
    htmlFor="${field.name}"
    className="mb-1.5 block text-sm font-medium text-gray-700"
  >
    ${capitalize(field.name)}
  </label>
  <textarea
    id="${field.name}"
    rows={4}
    placeholder="Enter ${field.name}"
    className={cn(
      'w-full rounded-lg border px-3 py-2',
      errors.${field.name}
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
    )}
    {...register('${field.name}')}
  />
  {errors.${field.name} && (
    <p className="mt-1.5 text-sm text-red-600">
      {errors.${field.name}?.message}
    </p>
  )}
</div>
```

**Select:**
```tsx
<Select
  label="${capitalize(field.name)}"
  options={[
    ${field.enumValues.map(v => `{ value: '${v}', label: '${capitalize(v)}' }`).join(',\n    ')}
  ]}
  value={${field.name}Value}
  onValueChange={(value) => setValue('${field.name}', value as ${field.enumType})}
  error={errors.${field.name}?.message}
  placeholder="Select ${field.name}"
/>
```

**Boolean (Checkbox):**
```tsx
<div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="${field.name}"
    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
    {...register('${field.name}')}
  />
  <label
    htmlFor="${field.name}"
    className="text-sm font-medium text-gray-700"
  >
    ${capitalize(field.name)}
  </label>
  {errors.${field.name} && (
    <p className="text-sm text-red-600">{errors.${field.name}?.message}</p>
  )}
</div>
```

**Date:**
```tsx
<Input
  label="${capitalize(field.name)}"
  type="date"
  error={errors.${field.name}?.message}
  {...register('${field.name}')}
/>
```

### Step 5: Generate Page Wrapper (if not inline)

If not inline, wrap form in a page component:

```tsx
export function ${formName}Page() {
  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <svg className="mr-2 h-4 w-4" /* back arrow */>
            {/* ... */}
          </svg>
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          ${formName.replace(/([A-Z])/g, ' $1').trim()}
        </h1>
        <p className="mt-2 text-gray-600">
          ${formName.includes('Create') ? 'Create a new' : 'Update the'} ${formName.replace(/^Create|^Update|Form$/, '').toLowerCase()}
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>
              Fill in the information below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <${formName} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

## Validation Message Templates

Generate helpful error messages:

| Validation | Message Template |
|------------|------------------|
| `min(n)` for string | `"${FieldName} must be at least ${n} characters"` |
| `max(n)` for string | `"${FieldName} must be less than ${n} characters"` |
| `min(n)` for number | `"${FieldName} must be at least ${n}"` |
| `max(n)` for number | `"${FieldName} must be less than ${n}"` |
| `email` | `"Invalid email address"` |
| `url` | `"Invalid URL"` |
| `required` (enum) | `"Please select a ${fieldName}"` |

## Success Response

```
✅ Form '${formName}' generated successfully!

Created:
  - ${isInline ? `Component: ${formName}` : `Page: src/pages/${formName}Page.tsx`}

Form fields (${fields.length}):
  ${fields.map(f => `- ${f.name} (${f.type})${f.optional ? ' - optional' : ''}`).join('\n  ')}

Features:
  - Zod schema with validation
  - React Hook Form integration
  - Error message display
  - Toast notifications
  ${mutationHook ? `- Connected to ${mutationHook}` : ''}
  ${onSuccessPath ? `- Redirects to ${onSuccessPath} on success` : ''}

Next steps:
  1. ${isInline ? 'Import and use the form component' : `Add route: <Route path="..." element={<${formName}Page />} />`}
  2. Customize validation messages if needed
  3. Test form validation with invalid data
  4. ${mutationHook ? 'Ensure mutation hook is properly configured' : 'Connect to mutation hook'}
```

## Error Handling

- Validate form name is PascalCase
- Ensure --fields argument is provided
- Validate field definitions are properly formatted
- Check mutation hook exists (if provided)
- Warn if select field has no enum values

## Notes

- Follow CreateItemPage.tsx as the reference implementation
- Always use zodResolver for form validation
- Include proper TypeScript types inferred from Zod schema
- Add toast notifications for success and error
- Use valueAsNumber for number inputs
- Use setValue/watch for controlled Select components
- Keep forms focused - one responsibility per form
- Consider adding a debug card showing form state (like in CreateItemPage.tsx)
