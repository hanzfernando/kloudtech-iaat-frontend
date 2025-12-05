import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/providers/AuthProvider'

export const Route = createFileRoute('/_main/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  return <div>Hello "/(main)/dashboard"!</div>
}
