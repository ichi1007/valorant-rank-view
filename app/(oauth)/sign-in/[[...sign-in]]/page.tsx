import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import Header from "@/component/SignIn/SignInHeader";

export const metadata: Metadata = {
  title: "SignInPage | げーむらんく",
  description: "Develop by ichi10.com",
};

export default function SignInPage() {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-[70vh]">
        <SignIn />
      </div>
    </>
  );
}
