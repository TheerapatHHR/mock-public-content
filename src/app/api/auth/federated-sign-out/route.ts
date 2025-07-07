import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
export async function GET(req: NextRequest) {

  const session = await auth();

  
  try {
    const id_token = req.headers.get("idToken");

    if (
      !id_token ||
      !process.env.AUTH_KEYCLOAK_END_SESSION_ENDPOINT ||
      !process.env.AUTH_KEYCLOAK_ID
    ) {
      throw Error;
    }

    const body = `client_id=${process.env.AUTH_KEYCLOAK_ID}&id_token_hint=${id_token}`;

    const endSession = await fetch(
      process.env.AUTH_KEYCLOAK_END_SESSION_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body,
      }
    );
    console.log(endSession);

    if (endSession && endSession.status && endSession.status >= 300) {
      console.warn("END_SESSION ERROR", endSession.status);
      throw Error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error Sign out",
    });
  }
}