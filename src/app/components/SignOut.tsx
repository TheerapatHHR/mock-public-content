
import { signOut } from "@/auth"
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default async function SignOut() {
    const session = await auth();
    return (
        <form
            action={async () => {
                "use server"
                // try {
                //     await fetch("http://localhost:4200/api/auth/federated-sign-out");
                // } catch (error) {
                //     console.error("Error during sign out:", error);
                // }
                try {
                    await manualLogout(session?.id_token);
                } catch (error) {
                    console.error("Error during manual logout:", error);
                }
                await signOut({ redirect: true, redirectTo: "/" });
            }}
        >
            <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"

            >
                <button type="submit">SignOut</button>
            </a>

        </form>
    )
}

async function manualLogout(token: string | undefined) {
    let url = `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL || "localhost:4200")}`;
    const body =  `client_id=${process.env.AUTH_KEYCLOAK_ID}&id_token_hint=${token}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body
    });
    // console.log("manualLogout response:", res);
    if (res && res.status && res.status >= 300) {
      console.warn("END_SESSION ERROR", res.status);
      return NextResponse.json({ success: false, message: "Error Sign out" });
    }
    return NextResponse.json({ success: true });
}