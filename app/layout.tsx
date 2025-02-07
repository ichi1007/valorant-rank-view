import type { Metadata } from "next";
import Footer from "@/component/footer";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "げーむらんく | あなたの配信画面を華やかにします！",
  description: "Develop by ichi",
};

const localization = {
  locale: "ja-JP",
  backButton: "戻る",
  formButtonPrimary: "続ける",
  formFieldLabel__emailAddress: "メールアドレス",
  formFieldInputPlaceholder__emailAddress_username:
    "メールアドレスまたはユーザー名",
  formFieldInputPlaceholder__emailAddress: "メールアドレス",
  formFieldLabel__emailAddress_username: "メールアドレスまたはユーザー名",
  formFieldLabel__password: "パスワード",
  formFieldAction__forgotPassword: "パスワードをお忘れですか？",
  formFieldInputPlaceholder__password: "パスワードを入力してください",
  footerActionLink__useAnotherMethod: "別の方法を使う",
  formFieldLabel__newPassword: "新しいパスワード",
  formFieldLabel__confirmPassword: "パスワードの確認",
  formFieldLabel__signOutOfOtherSessions:
    "他のすべてのデバイスからサインアウトする",

  waitlist: {
    start: {
      actionLink: "ログイン",
      actionText: "既にアカウントをお持ちですか？",
      formButton: "使用権をリクエスト",
      subtitle: "メールアドレスを入力してください。",
      title: "ウェイトリストに参加する",
      emailAddress: "メールアドレス",
    },
    success: {
      message: "すぐにリダイレクトされます...",
      subtitle: "順番が来ましたら、ご連絡いたします！",
      title: "ウェイティングリストに参加完了！",
    },
  },

  signIn: {
    start: {
      actionLink__join_waitlist: "参加する",
      actionLink__use_email: "Use email",
      actionLink__use_email_username: "Use email or username",
      actionLink__use_passkey: "Use passkey instead",
      actionLink__use_phone: "Use phone",
      actionLink__use_username: "Use username",
      actionText: "Don’t have an account?",
      actionText__join_waitlist: "ウェイティングリストに",
      subtitle: "Welcome back! Please sign in to continue",
      subtitleCombined: undefined,
      title: "{{applicationName}} にログインする",
      titleCombined: "{{applicationName}} にログイン",
    },
    password: {
      actionLink: "別の方法を使う",
      subtitle: "アカウントのパスワードを入力してください。",
      title: "パスワードを入力してください",
    },
    emailLink: {
      title: "メールリンクでサインイン",
      subtitle: "続行するにはメールリンクを確認してください",
      formTitle: "確認コードを入力",
      formSubtitle: "メールに送信された確認コードを入力してください",
      resendButton: "コードを再送信",
      unusedTab: {
        title: "未使用",
      },
      verified: {
        title: "確認完了",
        subtitle: "サインインが完了しました",
      },
      verifiedSwitchTab: {
        title: "メールを確認",
        subtitle: "メールを確認してください",
        titleNewTab: "新しいタブでメールを確認",
        subtitleNewTab: "新しいタブでメールを確認してください",
      },
      loading: {
        title: "サインイン中...",
        subtitle: "しばらくお待ちください",
      },
      failed: {
        title: "このメールリンクは無効です",
        subtitle: "サインインページに戻って、もう一度お試しください",
      },
      expired: {
        title: "このメールリンクは期限切れです",
        subtitle: "サインインページに戻って、もう一度お試しください",
      },
      clientMismatch: {
        title: "無効なリンク",
        subtitle: "このリンクは別のデバイスで開く必要があります",
      },
    },
    emailCode: {
      formTitle: "検証コード",
      resendButton: "コードが届きませんでしたか？ 再送する",
      subtitle: "",
      title: "メールボックスをチェックする",
    },
    unstable__errors: {
      form_param_nil: "このフィールドは必須であり、空にすることはできません。",
    },
    alternativeMethods: {
      actionLink: "助けを求める",
      actionText: "何もできることがありませんか？",
      blockButton__backupCode: "Use a backup code",
      blockButton__emailCode: "コードを受け取る {{identifier}}",
      blockButton__emailLink: "Email link to {{identifier}}",
      blockButton__passkey: "Sign in with your passkey",
      blockButton__password: "パスワードを入力してサインインする",
      blockButton__phoneCode: "Send SMS code to {{identifier}}",
      blockButton__totp: "Use your authenticator app",
      getHelp: {
        blockButton__emailSupport: "サポートを受ける",
        content:
          "アカウントへのサインインに問題がある場合は、電子メールでご連絡ください。",
        title: "助けを求める",
      },
      subtitle:
        "問題に直面していますか？ 以下のいずれかの方法でログインできます。",
      title: "別のアカウントを使う",
    },
    forgotPasswordAlternativeMethods: {
      blockButton__resetPassword: "パスワードのリセット",
      label__alternativeMethods: "または、別の方法でサインインする",
      title: "パスワードをお忘れですか？",
    },
    forgotPassword: {
      formTitle: "パスワード再設定コード",
      resendButton: "コードが届きませんでしたか？ 再送する",
      subtitle: "パスワードをリセットする",
      subtitle_email:
        "あなたのメールアドレスに送られたコードを入力してください。",
      title: "パスワードのリセット",
    },
    resetPassword: {
      formButtonPrimary: "パスワードのリセット",
      requiredMessage:
        "セキュリティ上の理由から、パスワードの再設定が必要です。",
      successMessage:
        "パスワードは正常に変更されました。 ログインします、しばらくお待ちください。",
      title: "新しいパスワードを設定する",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <ClerkProvider localization={localization} waitlistUrl="/waitlist">
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          />
        </head>
        <body>
          {children}
          <Footer />
        </body>
      </ClerkProvider>
    </html>
  );
}
