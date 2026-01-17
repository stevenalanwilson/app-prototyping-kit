import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useItems, useDeleteItem } from '@/hooks/useItems'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { formatDate, capitalize } from '@/lib/utils'
import type { Item } from '@/types'

export function ItemsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: items, isLoading, error } = useItems()
  const deleteItem = useDeleteItem()
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null)

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      await deleteItem.mutateAsync(itemToDelete.id)
      toast({
        title: 'Item deleted',
        description: `${itemToDelete.name} has been removed`,
        variant: 'success',
      })
      setItemToDelete(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'error',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading items...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-600">Error loading items</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Items</h1>
          <p className="mt-2 text-gray-600">
            Manage your items with TanStack Query
          </p>
        </div>
        <Button onClick={() => navigate('/items/new')}>
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Item
        </Button>
      </div>

      {items?.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 flex-col items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No items yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first item
            </p>
            <Button className="mt-6" onClick={() => navigate('/items/new')}>
              Create Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{item.name}</CardTitle>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {capitalize(item.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Created {formatDate(item.createdAt)}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setItemToDelete(item)}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setItemToDelete(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteItem.isPending}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
