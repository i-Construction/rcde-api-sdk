# RCDE API SDK

RCDE APIを使用するためのSDKです。

認証方法には、2 legged oauthと3 legged oauthの2種類があり、それぞれ必要な事前準備が異なります。

## インストール方法

npm、またはyarnを使用してインストールします。

```bash
npm install @i-con/api-sdk
# or
yarn add @i-con/api-sdk
```

## 事前準備 (2 legged oauth)

RCDEのサイトでアプリケーションを作成します。

<img src="docs/create-app.png" alt="RCDEのサイトでアプリケーションを作成" width="640px" style="" />

作成したアプリの「編集」ボタンから、クライアントIDとクライアントシークレットを取得します。また、APIを利用したいアプリのドメインを登録します。

<img src="docs/client-id-secret.png" alt="クライアントIDとクライアントシークレットの確認" width="640px" style="" />

### 使用方法 (2 legged oauth)

```typescript
import { RCDEClient2Legged } from "@i-con/api-sdk";

// APIクライアントの初期化
const client = new RCDEClient2Legged({
  // RCDEのアプリ設定画面で登録したドメイン (許可オリジン)
  domain: "https://yourapp.example.com",
  // RCDEのWebサイトのAPIエンドポイント e.g. https://api.rcde-dev.jp
  baseUrl: "https://api.rcde-dev.jp",
  // RCDEのアプリ設定画面で取得したクライアントIDとクライアントシークレット
  clientId: process.env.RCDE_CLIENT_ID!,
  clientSecret: process.env.RCDE_CLIENT_SECRET!,
});

// APIクライアントの認証
// この認証はAPIを利用する前に必ず行う必要があります
await client.authenticate();

// 現場の作成
const createConstructionRes = await client.createConstruction({
  name: "test constructon",
  address: "東京都千代田区一ツ橋2丁目5-10",
  contractedAt: new Date("2024-11-26"),
  period: new Date("2025-11-26"),
  advancePaymentRate: 20,
  contractAmount: 3500000000,
});

// 現場一覧の取得
const constructions = await client.getConstructionList();
const construction = constructions[0];

// 現場情報の取得
await client.getConstruction(construction.id);

// 現場に紐づく契約の取得
const contracts = await client.getContractList({
  constructionId: construction.id,
});

const contract = contracts[0];
const buffer = fs.readFileSync("assets/bunny.csv");

// 契約にファイルをアップロード
const uploadRes = await client.uploadContractFile({
  contractId: contract.id,
  name: "bunny.csv",
  buffer,
});

// アクセストークンのリフレッシュ(手動)
await client.refreshToken();
```

## 事前準備 (3 legged oauth)

1. 2 legged oauthと同様に、RCDEのサイトでアプリケーションを作成します。
2. RCDE上の3-leggedのログイン画面からログインします。(ID/PASSはRCDEユーザーの認証情報)

```bash
http://{rcdeのドメイン}/oauth/signIn?response_type=code&client_id={企業アプリケーション画面のクライアントID}&scope=all
# ※日本語の部分は必要な値を埋めてください
```

3. ログイン後、企業アプリケーション画面で設定したコールバックURLへリダイレクトされます。
4. コールバックURLのクエリ文字列の`code`に文字列が返ってくるので、その`code`の値を用いて`RCDEClient3Legged`のインスタンスを作成します。

### 使用方法 (3 legged oauth)

```typescript
import { RCDEClient3Legged } from "@i-con/api-sdk";

const client = new RCDEClient3Legged({
  // RCDEのアプリ設定画面で登録したドメイン (許可オリジン)
  domain: "https://yourapp.example.com",
  // RCDEのWebサイトのAPIエンドポイント e.g. https://api.rcde-dev.jp
  baseUrl: "https://api.rcde-dev.jp",
  // RCDEのアプリ設定画面で取得したクライアントIDとクライアントシークレット
  clientId: process.env.RCDE_CLIENT_ID!,
  clientSecret: process.env.RCDE_CLIENT_SECRET!,
  // コールバックURLのクエリ文字列の`code`の値
  authCode: codeFromCallback,
});

// 初回認証
await client.authenticate(codeFromCallback);

// トークンを取得して保存(永続化は利用側で)
const token = client.getToken();
saveToLocalStorage(token);

// 再起動時などは復元
client.setToken(loadFromLocalStorage());

// 自動リフレッシュ(有効期限の60秒前に自動更新)
const status = await client.getContractFileProcessingStatus(123);

// 手動で明示的にリフレッシュも可能
await client.refreshToken();
```

## トークンリフレッシュ仕様

### 3-legged

* A方式(`POST /ext/v2/oauth/token` + `grant_type=refresh_token`)を採用。
* 有効期限が60秒未満になるとSDK内部で自動リフレッシュ。
* 成功時は `this.token` が更新されるため、必要に応じて利用側で再保存。

### 2-legged

* エンドポイント: `POST /ext/v2/authenticated/refresh`
* `Authorization: Bearer <refreshToken>` でリクエスト送信。
* `this.token = { accessToken, refreshToken, expiresAt }` に更新(バグ修正版)。

## 注意事項

* Axios ベースで構築されており、`baseUrl` + `Origin` ヘッダを自動付与します。
* Swagger 定義に基づく生成クライアント (`api-2-legged.ts`, `api-3-legged.ts`) を内部使用しています。
* トークン永続化はSDK側では行いません。利用アプリで保存・復元を行ってください。
* API呼び出し失敗時は axiosの例外としてthrowされます。