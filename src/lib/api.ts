/**
 * Mock API client - replace with real API calls
 * For prototyping, this simulates network delays and responses
 */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface Item {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  createdAt: string
}

// Mock data store
let mockItems: Item[] = [
  {
    id: '1',
    name: 'First Item',
    description: 'This is a sample item',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Second Item',
    description: 'Another sample item',
    status: 'inactive',
    createdAt: new Date().toISOString(),
  },
]

export const api = {
  items: {
    list: async (): Promise<Item[]> => {
      await delay(500)
      return mockItems
    },

    get: async (id: string): Promise<Item> => {
      await delay(300)
      const item = mockItems.find((item) => item.id === id)
      if (!item) throw new Error('Item not found')
      return item
    },

    create: async (
      data: Omit<Item, 'id' | 'createdAt'>
    ): Promise<Item> => {
      await delay(600)
      const newItem: Item = {
        ...data,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
      }
      mockItems = [...mockItems, newItem]
      return newItem
    },

    update: async (id: string, data: Partial<Item>): Promise<Item> => {
      await delay(500)
      const index = mockItems.findIndex((item) => item.id === id)
      if (index === -1) throw new Error('Item not found')
      mockItems[index] = { ...mockItems[index]!, ...data }
      return mockItems[index]!
    },

    delete: async (id: string): Promise<void> => {
      await delay(400)
      mockItems = mockItems.filter((item) => item.id !== id)
    },
  },
}
