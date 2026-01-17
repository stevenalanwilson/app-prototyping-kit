# Development Checklists

Quick checklists for common development scenarios.

## ✅ Adding a New Page

- [ ] Create page component in `src/pages/[Name]Page.tsx`
- [ ] Add route in `src/App.tsx` under `<Route path="/" element={<Layout />}>`
- [ ] Add navigation link in `src/components/layout/Sidebar.tsx` navItems array
- [ ] Add page title and description in the page component
- [ ] Test navigation works from sidebar
- [ ] (Optional) Add route tests

## ✅ Adding a New API Resource

- [ ] Define TypeScript interface in `src/lib/api.ts`
- [ ] Add mock data array in `src/lib/api.ts`
- [ ] Implement API methods (list, get, create, update, delete) in `src/lib/api.ts`
- [ ] Create custom hooks file in `src/hooks/use[Resource].ts`
- [ ] Implement useQuery hook for fetching (e.g., `useProducts()`)
- [ ] Implement useMutation hooks for mutations (e.g., `useCreateProduct()`)
- [ ] Add proper queryKey for cache management
- [ ] Add onSuccess handlers to invalidate queries
- [ ] Export hooks from hooks file
- [ ] Test hooks in a page component

## ✅ Creating a New Form

- [ ] Define Zod schema for validation
- [ ] Create type from schema using `z.infer<typeof schema>`
- [ ] Setup useForm with zodResolver
- [ ] Create mutation hook (e.g., `useCreateItem()`)
- [ ] Implement onSubmit handler with try/catch
- [ ] Add toast notifications for success/error
- [ ] Use Input/Select components with register()
- [ ] Display validation errors with error prop
- [ ] Add submit button with isLoading state
- [ ] Test form validation with invalid data
- [ ] Test successful submission
- [ ] Test error handling

## ✅ Adding a New Reusable Component

- [ ] Create component file in `src/components/ui/[Component].tsx`
- [ ] Define Props interface with TypeScript
- [ ] Use forwardRef if component wraps native element
- [ ] Implement variants using object mapping
- [ ] Support className prop for customization using cn()
- [ ] Add JSDoc comments for complex props
- [ ] Export component from file
- [ ] Create test file `[Component].test.tsx`
- [ ] Test rendering and basic behavior
- [ ] Test all variants
- [ ] Test prop combinations
- [ ] Use in at least one page to verify

## ✅ Implementing Data Fetching

- [ ] Create/verify API method exists in `src/lib/api.ts`
- [ ] Create custom hook using useQuery
- [ ] Define proper queryKey (array with resource name)
- [ ] Set appropriate staleTime/cacheTime if needed
- [ ] Handle loading state in component
- [ ] Handle error state in component
- [ ] Handle empty state (no data) in component
- [ ] Test loading state
- [ ] Test error state
- [ ] Test successful data display

## ✅ Implementing Data Mutation

- [ ] Create API method in `src/lib/api.ts`
- [ ] Create custom hook using useMutation
- [ ] Add onSuccess handler to invalidate related queries
- [ ] Add onError handler for error logging
- [ ] Use mutation in component
- [ ] Show loading state during mutation (button isLoading)
- [ ] Show success toast notification
- [ ] Show error toast notification
- [ ] Test successful mutation
- [ ] Test error handling
- [ ] Verify related queries refetch

## ✅ Adding Client State (Zustand)

- [ ] Create store file in `src/stores/[name]Store.ts`
- [ ] Define state interface
- [ ] Implement store with create()
- [ ] Add state properties
- [ ] Add action methods
- [ ] Export store hook
- [ ] Import and use in component(s)
- [ ] Select only needed state slices
- [ ] Test state updates work
- [ ] (Optional) Add devtools middleware for debugging

## ✅ Styling a Component

- [ ] Use Tailwind utility classes for layout
- [ ] Use spacing utilities (p-, m-, gap-, space-)
- [ ] Add responsive classes (sm:, md:, lg:)
- [ ] Implement hover/focus states
- [ ] Add transitions for interactive elements
- [ ] Support dark mode if needed
- [ ] Make component accessible (ARIA labels, keyboard nav)
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Test on desktop viewport

## ✅ Adding Authentication

- [ ] Create auth context or store
- [ ] Create login page component
- [ ] Create protected route wrapper
- [ ] Implement login API call
- [ ] Store auth token (localStorage/cookie)
- [ ] Add token to API requests (headers)
- [ ] Implement logout functionality
- [ ] Add user profile query hook
- [ ] Protect routes that need auth
- [ ] Redirect to login when not authenticated
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Test protected routes redirect

## ✅ Integrating Real API

- [ ] Add environment variables to `.env`
- [ ] Create API client instance (fetch/axios)
- [ ] Replace mock delays with real API calls
- [ ] Update API methods to use real endpoints
- [ ] Add proper error handling
- [ ] Add request/response interceptors if needed
- [ ] Handle authentication headers
- [ ] Handle API error responses
- [ ] Update types based on real API responses
- [ ] Test all API calls work
- [ ] Test error scenarios

## ✅ Adding Tests

- [ ] Create test file next to component
- [ ] Import component and test utilities
- [ ] Write basic render test
- [ ] Test user interactions (clicks, typing)
- [ ] Test conditional rendering (loading, error, empty states)
- [ ] Test props variations
- [ ] Mock API calls/hooks if needed
- [ ] Use `renderWithProviders` for components using hooks
- [ ] Assert on user-visible content, not implementation
- [ ] Run tests with `npm test`
- [ ] Verify tests pass

## ✅ Deploying to Production

- [ ] Run `npm run build` locally to verify it builds
- [ ] Fix any TypeScript errors (`npm run typecheck`)
- [ ] Fix any linting errors (`npm run lint`)
- [ ] Set environment variables for production
- [ ] Update API URL to production endpoint
- [ ] Test production build locally (`npm run preview`)
- [ ] Configure hosting platform (Vercel, Netlify, etc.)
- [ ] Set up CI/CD pipeline
- [ ] Configure custom domain if needed
- [ ] Deploy to staging environment first
- [ ] Test all features in staging
- [ ] Deploy to production
- [ ] Verify production deployment works
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up analytics if needed

## ✅ Code Quality Check

- [ ] Run `npm run typecheck` - no TypeScript errors
- [ ] Run `npm run lint` - no linting errors
- [ ] Run `npm run format:check` - code is formatted
- [ ] Run `npm test` - all tests pass
- [ ] Review code for console.logs (remove or comment out)
- [ ] Check for unused imports
- [ ] Check for unused variables/functions
- [ ] Ensure components have proper prop types
- [ ] Ensure API errors are handled
- [ ] Verify loading states exist for async operations

## ✅ Performance Check

- [ ] Check bundle size (`npm run build` output)
- [ ] Lazy load routes if bundle is large
- [ ] Use React.memo for expensive components
- [ ] Verify images are optimized
- [ ] Check for unnecessary re-renders (React DevTools)
- [ ] Verify queries have appropriate staleTime
- [ ] Use proper queryKey for cache management
- [ ] Avoid selecting entire Zustand store
- [ ] Check Lighthouse score
- [ ] Test on slow network (Chrome DevTools throttling)

## ✅ Accessibility Check

- [ ] All interactive elements keyboard accessible
- [ ] Proper heading hierarchy (h1, h2, h3)
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Error messages are announced
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader
- [ ] Run axe DevTools accessibility scan

## ✅ Before Committing

- [ ] Code is formatted (`npm run format`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Tests pass (`npm test`)
- [ ] Tested in browser manually
- [ ] Removed debug code (console.logs, debuggers)
- [ ] Updated relevant documentation
- [ ] Meaningful commit message
- [ ] Small, focused commit (single concern)

## ✅ Before Creating PR

- [ ] Branch is up to date with main
- [ ] All commits are meaningful and squashed if needed
- [ ] PR description explains what and why
- [ ] Screenshots added if UI changes
- [ ] Tests added for new features
- [ ] Breaking changes documented
- [ ] Migration guide if needed
- [ ] Self-review completed
- [ ] Ready for team review
