import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/tasks/:path*",
    "/api/quests/:path*",
    "/api/inventory/:path*",
  ],
};