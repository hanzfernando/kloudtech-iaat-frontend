import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.authentication;
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
    throw redirect({ to: "/dashboard" });
  },
  component: RouteComponent,
})

function RouteComponent() {}
