import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import PageNotFound from "./components/PageNotFound";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: { authentication: undefined! },
  defaultNotFoundComponent: () => <PageNotFound />,
  defaultErrorComponent: () => <PageNotFound />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function InnerApp() {
  const authentication = useAuth();

  return (
    <RouterProvider router={router} context={{ authentication }} />
  );
}
