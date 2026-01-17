import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to the Prototyping Kit
        </h1>
        <p className="mt-2 text-gray-600">
          A minimal, production-ready starter for rapid web app development
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>
              Get started building your MVP in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This kit includes React, TypeScript, Tailwind CSS, and all the
              essential tools for rapid prototyping.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate('/items')}
            >
              View Items
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forms & Validation</CardTitle>
            <CardDescription>
              Type-safe forms with React Hook Form + Zod
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Built-in validation, error handling, and seamless integration
              with your data layer.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate('/items/new')}
            >
              Create Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Fetching</CardTitle>
            <CardDescription>
              TanStack Query for server state management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Automatic caching, background refetching, and optimistic updates
              out of the box.
            </p>
            <Button
              className="mt-4"
              variant="secondary"
            >
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
          <CardDescription>Modern, focused, and production-ready</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="font-medium text-gray-900">Frontend</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Vite</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Styling</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>Tailwind CSS</li>
                <li>Radix UI</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">State & Data</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>TanStack Query</li>
                <li>Zustand</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Forms & Testing</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>React Hook Form</li>
                <li>Zod</li>
                <li>Vitest</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
