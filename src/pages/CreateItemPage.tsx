import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateItem } from '@/hooks/useItems'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'

// Zod schema for form validation
const createItemSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be less than 200 characters'),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Please select a status',
  }),
})

type CreateItemFormData = z.infer<typeof createItemSchema>

export function CreateItemPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const createItem = useCreateItem()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      status: 'active',
    },
  })

  const onSubmit = async (data: CreateItemFormData) => {
    try {
      await createItem.mutateAsync(data)
      toast({
        title: 'Item created',
        description: `${data.name} has been created successfully`,
        variant: 'success',
      })
      navigate('/items')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create item',
        variant: 'error',
      })
    }
  }

  const statusValue = watch('status')

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/items')}
          className="mb-4"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Items
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create Item</h1>
        <p className="mt-2 text-gray-600">
          Add a new item with form validation using React Hook Form + Zod
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>
              Fill in the information below to create a new item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Name"
                placeholder="Enter item name"
                error={errors.name?.message}
                {...register('name')}
              />

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Enter item description"
                  className={`w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.description
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <Select
                label="Status"
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                value={statusValue}
                onValueChange={(value) =>
                  setValue('status', value as 'active' | 'inactive')
                }
                error={errors.status?.message}
                placeholder="Select a status"
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/items')}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={createItem.isPending}>
                  Create Item
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Example card showing form state for debugging */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Form State (Debug)</CardTitle>
            <CardDescription>
              Real-time form validation state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded bg-gray-50 p-4 text-xs">
              {JSON.stringify(
                {
                  values: watch(),
                  errors: errors,
                  isSubmitting: createItem.isPending,
                },
                null,
                2
              )}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
