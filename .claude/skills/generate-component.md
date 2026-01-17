# generate-component

Generate a new UI component following the kit's patterns with TypeScript, variants, and tests.

## Usage

```
/generate-component <ComponentName> [options]
```

## Arguments

- `ComponentName` (required): The name of the component (e.g., Badge, Avatar, Switch)
- `--variants` (optional): Comma-separated list of variant names (e.g., `primary,secondary,outline`)
- `--no-forward-ref` (optional): Skip forwardRef wrapper
- `--no-test` (optional): Don't generate test file
- `--base` (optional): Base HTML element (default: `div`)

## Examples

```bash
# Simple component
/generate-component Badge

# Component with variants
/generate-component Badge --variants="primary,secondary,success,warning,error"

# Button-like component
/generate-component IconButton --variants="primary,ghost,outline" --base="button"

# Component without forwardRef
/generate-component Container --no-forward-ref

# Component without tests (not recommended)
/generate-component Spacer --no-test
```

## What This Skill Does

This skill generates a production-ready UI component following the kit's established patterns:

### 1. Component File (`src/components/ui/[ComponentName].tsx`)

Creates:
- TypeScript Props interface extending HTMLAttributes
- forwardRef wrapper (if applicable)
- Variant system using object mapping
- Size system (if applicable)
- className support with `cn()` utility
- Proper TypeScript types
- JSDoc comments
- displayName for React DevTools

### 2. Test File (`src/components/ui/[ComponentName].test.tsx`)

Generates:
- Basic render test
- Variant tests
- Interaction tests (if interactive)
- Accessibility tests
- Prop combination tests
- Follows Button.test.tsx pattern

## Implementation Instructions

When this skill is invoked, follow these steps:

### Step 1: Parse Arguments and Determine Component Type

```typescript
const componentName = args[0] // e.g., "Badge"
const variants = getArgValue('--variants')?.split(',') || ['default']
const shouldForwardRef = !hasFlag('--no-forward-ref')
const shouldGenerateTest = !hasFlag('--no-test')
const baseElement = getArgValue('--base') || 'div'

// Determine if interactive (button, input, etc.)
const isInteractive = ['button', 'input', 'select', 'textarea', 'a'].includes(baseElement)
```

### Step 2: Generate Component File

Follow this template based on Button.tsx pattern:

```typescript
import { ${getElementType(baseElement)}HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ${componentName}Props extends ${getElementType(baseElement)}HTMLAttributes<HTML${getElementType(baseElement)}Element> {
  variant?: ${variants.map(v => `'${v}'`).join(' | ')}
  ${isInteractive ? "isLoading?: boolean\n  " : ""}${baseElement === 'button' ? "disabled?: boolean" : ""}
}

const variantStyles = {
  ${variants.map(v => `${v}: '${generateVariantClasses(v)}'`).join(',\n  ')}
}

export const ${componentName} = forwardRef<HTML${getElementType(baseElement)}Element, ${componentName}Props>(
  (
    {
      variant = '${variants[0]}',
      ${isInteractive ? 'isLoading = false,' : ''}
      className,
      children,
      ${baseElement === 'button' ? 'disabled,' : ''}
      ...props
    },
    ref
  ) => {
    return (
      <${baseElement}
        ref={ref}
        ${baseElement === 'button' ? 'disabled={disabled || isLoading}' : ''}
        className={cn(
          'base-styles-here',
          variantStyles[variant],
          ${isInteractive ? "'transition-colors duration-150'," : ''}
          className
        )}
        {...props}
      >
        ${isInteractive && baseElement === 'button' ? `{isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin" /* spinner SVG */>
            {/* Loading spinner */}
          </svg>
        )}` : ''}
        {children}
      </${baseElement}>
    )
  }
)

${componentName}.displayName = '${componentName}'
```

### Step 3: Generate Variant Styles

Based on variant names, generate appropriate Tailwind classes:

| Variant | Suggested Tailwind Classes |
|---------|---------------------------|
| `primary` | `bg-primary-600 text-white hover:bg-primary-700` |
| `secondary` | `bg-gray-200 text-gray-900 hover:bg-gray-300` |
| `outline` | `border-2 border-gray-300 bg-transparent hover:bg-gray-50` |
| `ghost` | `bg-transparent hover:bg-gray-100` |
| `success` | `bg-green-600 text-white hover:bg-green-700` |
| `warning` | `bg-yellow-600 text-white hover:bg-yellow-700` |
| `error` / `danger` | `bg-red-600 text-white hover:bg-red-700` |
| `default` | `bg-white border border-gray-200 text-gray-900` |

### Step 4: Generate Test File

Follow Button.test.tsx pattern:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ${componentName} } from './${componentName}'

describe('${componentName}', () => {
  it('renders with children', () => {
    render(<${componentName}>Test Content</${componentName}>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  ${variants.length > 1 ? `
  it('applies variant styles', () => {
    const { rerender } = render(<${componentName} variant="${variants[0]}">Content</${componentName}>)
    expect(screen.getByText('Content')).toHaveClass('/* variant class */')

    ${variants.slice(1).map(v => `
    rerender(<${componentName} variant="${v}">Content</${componentName}>)
    expect(screen.getByText('Content')).toHaveClass('/* ${v} class */')
    `).join('\n')}
  })
  ` : ''}

  ${isInteractive && baseElement === 'button' ? `
  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<${componentName} onClick={handleClick}>Click me</${componentName}>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<${componentName} disabled>Disabled</${componentName}>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<${componentName} isLoading>Loading</${componentName}>)
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(button.querySelector('svg')).toBeInTheDocument()
  })
  ` : ''}

  it('merges custom className', () => {
    render(<${componentName} className="custom-class">Content</${componentName}>)
    expect(screen.getByText('Content')).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = { current: null }
    render(<${componentName} ref={ref}>Content</${componentName}>)
    expect(ref.current).toBeInstanceOf(HTML${getElementType(baseElement)}Element)
  })
})
```

### Step 5: Determine Base Styles

Based on component name and base element, suggest appropriate base Tailwind classes:

**For Badges/Labels:**
```css
inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
```

**For Buttons:**
```css
inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium
focus:outline-none focus:ring-2 focus:ring-offset-2
disabled:cursor-not-allowed disabled:opacity-60
```

**For Cards/Containers:**
```css
rounded-lg border bg-white shadow-sm
```

**For Avatars:**
```css
inline-flex items-center justify-center rounded-full bg-gray-200
```

**For Input-like components:**
```css
w-full rounded-lg border border-gray-300 px-3 py-2
focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
disabled:cursor-not-allowed disabled:bg-gray-50
```

## Component Patterns by Type

### Badge Component
- Variants: status-based (success, warning, error)
- Small size by default
- No interaction
- Pill-shaped

### Avatar Component
- Variants: sizes (sm, md, lg)
- Circular
- Optional image with fallback initials
- No forwardRef needed

### Switch/Toggle Component
- Variants: sizes
- Interactive (button base)
- Controlled component
- ARIA attributes (role="switch")

### Tooltip Component
- Uses Radix UI primitive
- Variants: positions (top, bottom, left, right)
- Portal rendering

## Success Response

After successful generation, report:

```
✅ Component '${componentName}' generated successfully!

Created files:
  - src/components/ui/${componentName}.tsx
  ${shouldGenerateTest ? `- src/components/ui/${componentName}.test.tsx` : ''}

Component features:
  - TypeScript Props interface
  ${shouldForwardRef ? '- forwardRef support' : ''}
  - ${variants.length} variant${variants.length > 1 ? 's' : ''}: ${variants.join(', ')}
  - className support for customization
  ${shouldGenerateTest ? '- Comprehensive test coverage' : ''}

Next steps:
  1. Import and use: import { ${componentName} } from '@/components/ui/${componentName}'
  2. Customize variant styles in the component
  3. Run tests: npm test ${componentName}.test.tsx
  4. Add to Storybook (if using)
```

## Error Handling

- Validate component name is PascalCase
- Check if component already exists
- Ensure variant names are valid CSS identifiers
- Validate base element is a valid HTML element

## Notes

- Always follow the Button.tsx pattern as the reference
- Include proper TypeScript types with generics where appropriate
- Use `cn()` utility for className merging
- Add displayName for better debugging
- Keep components focused and composable
- Prefer composition over configuration
- Include accessibility attributes (ARIA) for interactive components
