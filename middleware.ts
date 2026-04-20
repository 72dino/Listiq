import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({});

export const config = {
  // Ovaj matcher osigurava da Clerk štiti sve stranice osim statičnih fajlova
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};