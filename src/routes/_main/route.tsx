import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import type { AuthContext } from '@/providers/AuthProvider'

export const Route = createFileRoute('/_main')({
  beforeLoad: async ({ context }) => {
    const auth = (context.authentication as AuthContext) // provided via Router context
    if (!auth?.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-sm text-muted-foreground">Checking authentication…</div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-md rounded-md border p-4">
        <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          {error?.message ?? 'Failed to verify authentication.'}
        </p>
      </div>
    </div>
  ),
})

function RouteComponent() {
  // Auth already ensured in beforeLoad; render nested routes
  return <Outlet />
}
