import type { AuthContext } from "@/providers/AuthProvider";
import { Outlet } from "@tanstack/react-router";
import PageNotFound from "@/components/PageNotFound";

import { createRootRouteWithContext } from "@tanstack/react-router";
type RouterContext = {
  authentication: AuthContext;
};
export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="h-screen">
      <Outlet />
    </div>
  ),
  notFoundComponent: () => <PageNotFound />,
});
