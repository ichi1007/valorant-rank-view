import { Waitlist } from "@clerk/nextjs";
import type { Metadata } from "next";
import Header from "@/component/SignIn/SignInHeader";

export const metadata: Metadata = {
  title: "WaitlistPage | げーむらんく",
  description: "Develop by ichi10.com",
};

export default function SignInPage() {
  return (
    <>
      <Header />
      <div
        id="waitlist"
        className="flex justify-center items-center flex-wrap mb-10 h-[90vh]"
      >
        <div className="max-w-[540px]">
          <h1 className="text-4xl font-bold mb-4 mx-2">Join Waitlist Now!</h1>
          <p className="mx-2">
            メールアドレスを入力するだけでアプリを使用する権限を申請することができます。
          </p>
          <p className="mx-2 mt-1 text-xs">
            Gmailの方は
            <span className="font-bold">&quot;プロモーション&quot;</span>
            の受信箱に招待状が送られます。
            <br />
            お手数をおかけいたしますが、連絡が遅い場合は一度ご確認ください。
          </p>
        </div>
        <div className="flex justify-center my-5 mx-5">
          <Waitlist />
        </div>
      </div>
    </>
  );
}
