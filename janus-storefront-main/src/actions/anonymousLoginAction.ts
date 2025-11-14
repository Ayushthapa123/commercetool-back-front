"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]";
import { COOKIE_SECURE } from "@/cookies";
import { encode } from "next-auth/jwt";
import { NextResponse } from "next/server";

/**
 * Generates anonymous user id and stores as next auth cookie via jwt token
 * @returns the anonymous user id
 */
export default async function anonymousLoginAction(): Promise<string> {
  const anonUserId = `anon-${crypto.randomUUID()}`;
  const anonUser = {
    id: anonUserId,
    name: "Anonymous",
  };

  // 1. Encode JWT token for session
  const token = await encode({
    secret: authOptions.secret!,
    token: {
      id: anonUser.id,
      name: anonUser.name,
    },
  });

  // 2. Create response and attach session cookie
  const response = NextResponse.json({
    message: "Anonymous login successful",
    user: anonUser,
  });

  response.cookies.set("next-auth.session-token", token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
  });

  return anonUserId;
}
