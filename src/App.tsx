import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { ItemsPage } from '@/pages/ItemsPage'
import { CreateItemPage } from '@/pages/CreateItemPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ToastProvider } from '@/components/ui/Toast'

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="items" element={<ItemsPage />} />
          <Route path="items/new" element={<CreateItemPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}

export default App
