import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

export function SettingsPage() {
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated',
      variant: 'success',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your application preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Name"
              placeholder="Enter your name"
              defaultValue="John Doe"
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              defaultValue="john@example.com"
            />
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email notifications</p>
                <p className="text-sm text-gray-500">
                  Receive updates via email
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push notifications</p>
                <p className="text-sm text-gray-500">
                  Receive push notifications in your browser
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Delete account</p>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="danger" size="sm">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
