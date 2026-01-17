# Claude Skills for App Prototyping Kit

This directory contains Claude Skills that accelerate development by automating common tasks following the kit's established patterns.

## Available Skills (Phase 1)

### 1. `/scaffold-resource` 🏗️

**Purpose:** Generate complete CRUD setup for a new resource in minutes.

**What it creates:**
- TypeScript interface and mock API
- React Query hooks (list, get, create, update, delete)
- List page with grid layout and delete confirmation
- Create page with validated form
- Routes and navigation links

**Example:**
```bash
/scaffold-resource Product --fields="name:string,price:number,inStock:boolean,category:string"
```

**Time saved:** 30-45 minutes per resource

---

### 2. `/generate-component` 🎨

**Purpose:** Generate production-ready UI components with tests.

**What it creates:**
- Component file with TypeScript Props interface
- Variant system and className support
- forwardRef wrapper for native elements
- Comprehensive test file
- Accessibility considerations

**Example:**
```bash
/generate-component Badge --variants="primary,secondary,success,warning,error"
```

**Time saved:** 10-15 minutes per component

---

### 3. `/build-form` 📋

**Purpose:** Generate validated forms with React Hook Form + Zod.

**What it creates:**
- Zod schema with validation rules
- React Hook Form setup
- Form UI with Input/Select components
- Error handling and toast notifications
- Submit logic with mutation integration

**Example:**
```bash
/build-form CreateProduct --fields="name:string:min(3),price:number:min(0),category:select:enum(electronics,clothing,food)" --mutation="useCreateProduct" --on-success="/products"
```

**Time saved:** 15-20 minutes per form

---

## Quick Start

### Prerequisites

These skills are designed to work with Claude Code or any Claude interface that supports skills.

### Using a Skill

Simply invoke the skill with the `/` prefix:

```bash
/scaffold-resource Product --fields="name:string,price:number"
```

Claude will:
1. Read the skill instructions
2. Follow the established patterns from the codebase
3. Generate all necessary files
4. Report what was created and next steps

### Skill Workflow

1. **Invoke skill** with appropriate arguments
2. **Review generated code** in your editor
3. **Test the feature** (`npm run dev`)
4. **Customize as needed** (styling, validation, etc.)
5. **Commit** when satisfied

---

## Common Workflows

### Adding a New Feature (Full Stack)

```bash
# 1. Scaffold the resource
/scaffold-resource Task --fields="title:string,description:string,completed:boolean,dueDate:string"

# 2. Customize the form validation (manual)
# Edit src/pages/CreateTaskPage.tsx to add custom rules

# 3. Test it
npm run dev
# Navigate to /tasks

# 4. Generate additional components if needed
/generate-component TaskBadge --variants="pending,completed,overdue"
```

**Result:** Complete CRUD feature in 5-10 minutes

### Building a Custom Form

```bash
# Generate the form
/build-form UserProfile --fields="name:string:min(3),email:email,bio:textarea:max(500):optional,notifications:boolean" --mutation="useUpdateProfile" --on-success="/profile"

# Use in your page component
# The form is ready to import and use
```

**Result:** Production-ready form in 3-5 minutes

### Creating UI Components

```bash
# Simple component
/generate-component Alert --variants="info,success,warning,error"

# Interactive component
/generate-component Toggle --variants="sm,md,lg" --base="button"

# Then customize styling and behavior
```

**Result:** Component with tests in 2-3 minutes

---

## Skill Arguments Reference

### scaffold-resource

| Argument | Required | Description | Example |
|----------|----------|-------------|---------|
| ResourceName | ✅ | PascalCase name | `Product`, `User`, `Task` |
| --fields | ❌ | Field definitions | `name:string,price:number` |

### generate-component

| Argument | Required | Description | Example |
|----------|----------|-------------|---------|
| ComponentName | ✅ | PascalCase name | `Badge`, `Avatar` |
| --variants | ❌ | Variant names | `primary,secondary,outline` |
| --base | ❌ | HTML element | `button`, `div` (default) |
| --no-forward-ref | ❌ | Skip forwardRef | Flag only |
| --no-test | ❌ | Skip test file | Flag only |

### build-form

| Argument | Required | Description | Example |
|----------|----------|-------------|---------|
| FormName | ✅ | PascalCase name | `CreateProduct` |
| --fields | ✅ | Field definitions | See field format below |
| --mutation | ❌ | Mutation hook | `useCreateProduct` |
| --on-success | ❌ | Redirect path | `/products` |
| --inline | ❌ | Inline component | Flag only |

**Field Format:**
```
name:type[:validation]
```

**Types:** `string`, `email`, `number`, `boolean`, `select`, `textarea`, `date`, `url`

**Validations:** `min(n)`, `max(n)`, `optional`, `enum(a,b,c)`

---

## Best Practices

### ✅ Do

- **Use skills as starting points** - Generated code is meant to be customized
- **Review generated code** - Ensure it fits your specific needs
- **Follow naming conventions** - Use PascalCase for components/resources
- **Test after generation** - Run `npm run dev` and verify functionality
- **Commit incrementally** - Commit after each successful generation

### ❌ Don't

- **Blindly accept output** - Always review and customize
- **Skip testing** - Generated code should be tested
- **Ignore TypeScript errors** - Fix any type issues immediately
- **Over-generate** - Only create what you need
- **Forget to update docs** - Update project docs if adding major features

---

## Customization After Generation

### Scaffold Resource Customization

After running `/scaffold-resource Product`:

1. **Update mock data** in `src/lib/api.ts` with realistic examples
2. **Enhance validation** in `CreateProductPage.tsx` Zod schema
3. **Customize list layout** in `ProductsPage.tsx` (table vs grid)
4. **Add filters/search** to the list page
5. **Style components** to match your design system

### Component Customization

After running `/generate-component Badge`:

1. **Adjust variant styles** to match your brand colors
2. **Add size variants** if needed (sm, md, lg)
3. **Enhance accessibility** (ARIA labels, keyboard nav)
4. **Add animations** (transitions, hover effects)
5. **Create compound components** if complex

### Form Customization

After running `/build-form CreateProduct`:

1. **Refine validation messages** for better UX
2. **Add conditional fields** based on other field values
3. **Implement file uploads** if needed
4. **Add real-time validation** feedback
5. **Enhance error handling** with specific error types

---

## Troubleshooting

### Skill doesn't execute

- Ensure you're using the correct syntax: `/skill-name arguments`
- Check that the skill file exists in `.claude/skills/`
- Verify arguments are properly formatted

### Generated code has errors

- Run `npm run typecheck` to see all TypeScript errors
- Ensure dependencies are installed (`npm install`)
- Check that imported components/hooks exist
- Review the skill instructions for proper usage

### Conflicts with existing code

- Skills check for existing files before creating
- If file exists, skill will warn you
- Manually merge changes or rename existing file
- Use version control to track changes

### Need to modify a skill

- Skills are in `.claude/skills/` as Markdown files
- Edit the instructions to match your preferences
- Test changes by invoking the skill
- Share improvements with the team

---

## Tips for Maximum Productivity

### 1. Chain Skills Together

```bash
# Scaffold resource
/scaffold-resource Order

# Generate status badge component
/generate-component OrderStatus --variants="pending,processing,shipped,delivered"

# Add to your OrdersPage manually
```

### 2. Use Consistent Naming

```bash
# ✅ Good
/scaffold-resource Product
/build-form CreateProduct

# ❌ Confusing
/scaffold-resource product
/build-form NewProdForm
```

### 3. Start Simple, Enhance Later

Generate with minimal fields, then add complexity:

```bash
# Start simple
/scaffold-resource Task --fields="title:string,completed:boolean"

# Later, add more fields manually in api.ts
```

### 4. Learn from Generated Code

- Generated code follows best practices
- Use it as a learning resource
- Adapt patterns to other parts of your app

### 5. Combine with Manual Coding

Skills handle boilerplate, you handle the unique logic:

```bash
# Generate the structure
/scaffold-resource Analytics

# Then manually add:
# - Custom hooks for data aggregation
# - Chart components
# - Real-time data subscriptions
```

---

## Coming Soon (Phase 2 & 3)

- `/connect-api` - Replace mock API with real endpoints
- `/generate-tests` - Add tests to existing components
- `/add-auth` - Scaffold authentication system
- `/optimize-bundle` - Analyze and optimize bundle size
- `/make-accessible` - Enhance accessibility compliance

---

## Feedback & Improvements

These skills are designed to evolve with your needs. To suggest improvements:

1. Note what works well and what doesn't
2. Identify patterns you use frequently
3. Create custom skills for your team's workflows
4. Share successful patterns with the community

---

## Resources

- **Kit Documentation:** `/docs/`
- **Example Code:** Check existing pages/components
- **Patterns Reference:** `docs/DEVELOPMENT.md`
- **Checklists:** `docs/CHECKLIST.md`

**Happy building! 🚀**
