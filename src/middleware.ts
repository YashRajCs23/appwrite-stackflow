import { NextResponse, NextRequest } from "next/server";
import getOrCreateDB from "./models/server/dbSetup";
import getOrCreateStorage from "./models/server/storageSetup";

// Middleware to ensure database and storage are set up before proceeding
export async function middleware(request: NextRequest) {
  await Promise.all([
    getOrCreateDB(),
    getOrCreateStorage(),
  ]);

  return NextResponse.next();
}

export const config = {
  /* 
    Match all request paths EXCEPT the ones that start with:
    - /api
    - /_next (this includes both _next/static and _next/image)
    - /favicon.ico
  */
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
