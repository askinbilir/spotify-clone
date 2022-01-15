import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
	const token = await getToken({ req, secret: process.env.JWT_SECRET });

	const { pathname } = req.nextUrl;

	// Allow the requests if the following true...
	// 1 - It's a request for next-auth session & provider fetching
	// 2 - The token exist

	if (pathname.includes("/api/auth") || token) {
		if (pathname == "/login") return NextResponse.redirect("/");
		
		return NextResponse.next();
	}

	// Redirect them to login if they don't have a token and are requesting a protected route
	if (!token && pathname !== "/login") return NextResponse.redirect("/login");
}
