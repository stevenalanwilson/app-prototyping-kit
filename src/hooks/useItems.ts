import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Item } from '@/lib/api'

const ITEMS_QUERY_KEY = ['items']

export function useItems() {
  return useQuery({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: api.items.list,
  })
}

export function useItem(id: string) {
  return useQuery({
    queryKey: [...ITEMS_QUERY_KEY, id],
    queryFn: () => api.items.get(id),
    enabled: !!id,
  })
}

export function useCreateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.items.create,
    onSuccess: () => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY })
    },
  })
}

export function useUpdateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Item> }) =>
      api.items.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ITEMS_QUERY_KEY, variables.id],
      })
    },
  })
}

export function useDeleteItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.items.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY })
    },
  })
}
