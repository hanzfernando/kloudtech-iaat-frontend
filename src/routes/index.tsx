import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
     const { isAuthenticated } = context.authentication;
     console.log("Root route beforeLoad - isAuthenticated:", isAuthenticated);
     if (!isAuthenticated) {
       throw redirect({
         to: "/login",
       });
     }
      throw redirect({
         to: "/dashboard",
       });
   },
  component: RouteComponent,
})

function RouteComponent() {
}
