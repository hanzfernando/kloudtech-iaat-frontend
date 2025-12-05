import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/user/"!</div>
}
