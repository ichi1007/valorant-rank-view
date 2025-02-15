import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "げーむらんく | あなたの配信画面をちょびっとだけ豪華に？",
  description: "Develop by ichi",
  openGraph: {
    images: [
      {
        url: "https://game-rank.ichi10.com/site-thumbnail.png",
      },
    ],
  },
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
  formFieldLabel__username: "ユーザー名",
  badge__primary: "プライマリー",
  badge__unverified: "未検証",
  formButtonPrimary__verify: "確認",
  formFieldLabel__currentPassword: "現在のパスワード",
  badge__thisDevice: "今のデバイス",

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
      actionText__join_waitlist: "ウェイティングリストに",
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
      blockButton__emailLink: "{{identifier}} にEメールリンクを送る",
      blockButton__password: "パスワードを入力してサインインする",
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

  userButton: {
    action__addAccount: "アカウント追加",
    action__manageAccount: "アカウント管理",
    action__signOut: "サインアウト",
    action__signOutAll: "すべてのアカウントからサインアウトする",
  },

  userProfile: {
    formButtonPrimary__save: "保存",
    formButtonReset: "キャンセル",
    formButtonPrimary__add: "追加",
    formButtonPrimary__remove: "削除",

    navbar: {
      account: "プロフィール",
      description: "アカウント情報の管理",
      security: "セキュリティ",
      title: "アカウント",
    },

    start: {
      headerTitle__account: "プロフィール詳細",
      headerTitle__security: "セキュリティ",
      profileSection: {
        primaryButton: "プロフィール更新",
        title: "プロフィール",
      },

      usernameSection: {
        primaryButton__setUsername: "ユーザー名を設定する",
        primaryButton__updateUsername: "ユーザー名の更新",
        title: "ユーザー名",
      },

      emailAddressesSection: {
        destructiveAction: "メール削除",
        detailsAction__nonPrimary: "プライマリーに設定",
        detailsAction__primary: "Complete verification",
        detailsAction__unverified: "検証",
        primaryButton: "メールアドレスの追加",
        title: "メールアドレス",
      },

      passwordSection: {
        primaryButton__setPassword: "パスワード設定",
        primaryButton__updatePassword: "パスワードの更新",
        title: "パスワード",
      },

      activeDevicesSection: {
        destructiveAction: "デバイスからサインアウトする",
        title: "使用中デバイス",
      },

      dangerSection: {
        deleteAccountButton: "アカウント削除",
        title: "アカウント削除",
      },
    },

    profilePage: {
      fileDropAreaHint: "推奨サイズ1:1、10MBまで。",
      imageFormDestructiveActionSubtitle: "削除",
      imageFormSubtitle: "アップロード",
      imageFormTitle: "プロフィール画像",
      readonly:
        "あなたのプロフィール情報は、企業接続によって提供されたものであり、編集することはできません。",
      successMessage: "プロフィールが更新されました。",
      title: "プロフィール更新",
    },

    usernamePage: {
      successMessage: "ユーザー名が更新されました。",
      title__set: "ユーザー名を設定する",
      title__update: "ユーザー名の更新",
    },

    emailAddressPage: {
      formHint:
        "アカウントに追加する前に、このメールアドレスを確認する必要があります。",
      title: "メールアドレスの追加",
      verifyTitle: "メールアドレスの確認",
      emailCode: {
        formHint: "認証コードが記載されたメールアドレスに送信されます。",
        formSubtitle:
          "{{identifier}} に送信された認証コードを入力してください。",
        formTitle: "検証コード",
        resendButton: "コードが届きませんでしたか？ 再送する",
        successMessage:
          "メールアドレス {{identifier}} がアカウントに追加されました。",
      },

      removeResource: {
        messageLine1: "{{identifier}} はこのアカウントから削除されます。",
        messageLine2: "このメールアドレスではサインインできなくなります。",
        successMessage: "{{emailAddress}} がアカウントから削除されました。",
        title: "メールアドレスの削除",
      },
    },

    passwordPage: {
      checkboxInfoText__signOutOfOtherSessions:
        "古いパスワードを使用している可能性のある他のすべてのデバイスからサインアウトすることをお勧めします。",
      readonly: "現在、パスワードの編集はできません。",
      successMessage__set: "パスワードが設定されました。",
      successMessage__signOutOfOtherSessions:
        "他のすべてのデバイスはサインアウトされている。",
      successMessage__update: "パスワードが更新されました。",
      title__set: "パスワード設定",
      title__update: "パスワードの更新",
    },

    deletePage: {
      actionDescription: "下に「Delete account」と入力して続行します。",
      confirm: "アカウント削除",
      messageLine1: "本当にアカウントを削除しますか？",
      messageLine2: "この行為は取り消すことができません。",
      title: "アカウント削除",
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
          {/* <!-- Google tag (gtag.js) --> */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-9LP2P81ZBK"
          />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-9LP2P81ZBK');
            `}
          </script>

          {/* Apple */}
          <link rel="apple-touch-icon" href="./favicon.ico" />
          <meta name="apple-mobile-web-app-title" content="げーむらんく" />

          {/* OGP設定 */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@gamegank_app" />
        </head>
        <body>{children}</body>
      </ClerkProvider>
    </html>
  );
}
