import { createFileRoute, redirect, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import type { AuthContext } from '@/providers/AuthProvider'
import { AppShell } from '@/components/AppSidebar'

export const Route = createFileRoute('/_main')({
  beforeLoad: async ({ context }) => {
    const auth = (context.authentication as AuthContext) // provided via Router context
    // If still loading, let the route render its pendingComponent.
    if (auth?.isAuthLoading) {
      return
    }
    // Once loading finishes, gate access based on authentication state.
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
  const { isAuthenticated, isAuthLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate({ to: '/login', replace: true })
    }
  }, [isAuthLoading, isAuthenticated, navigate])

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Checking authentication…</div>
      </div>
    )
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
