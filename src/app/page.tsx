import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import { auth } from "@/auth";
import Image from "next/image";

export default async function Home() {

  const session = await auth();
  // console.log(session);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center ">

        <h1 className="flex item-center text-[60px]">PUBLIC-CONTENT</h1>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div className="text-sm sm:text-base">
            {session?.user ? (<SignOut />) : (<SignIn />)}
          </div>

          {/* <SignOut /> */}
        </div>
      </main>

    </div>
  );
}
