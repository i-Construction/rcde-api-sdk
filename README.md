# RCDE API SDK

RCDE APIを使用するためのSDKです。

認証方法には、2 legged oauthと3 legged oauthの2種類があり、
それぞれ必要な事前準備が異なります。

## インストール方法

npm、またはyarnを使用してインストールします。

```bash
npm install @i-con/api-sdk
# or
yarn add @i-con/api-sdk
```

## 事前準備 (2 legged oauth)

RCDEのサイトでアプリケーションを作成します。

<img src="docs/create-app.png"
  alt="RCDEのサイトでアプリケーションを作成"
  width="640px"
  style="" />

作成したアプリの「編集」ボタンから、クライアントIDとクライアントシークレットを取得します。
また、APIを利用したいアプリのドメインを登録します。

<img src="docs/client-id-secret.png"
  alt="クライアントIDとクライアントシークレットの確認"
  width="640px"
  style="" />

### 使用方法 (2 legged oauth)

```typescript

// APIクライアントの初期化
const client = new RCDEClient2Legged({
  // RCDEのWebサイトのURL e.g. https://api.rcde.jp
  domain,
  // RCDEのアプリ設定画面で登録したドメイン
  baseUrl,
  // RCDEのアプリ設定画面で取得したクライアントIDとクライアントシークレット
  clientId,
  clientSecret,
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
const constructions = await client.getConstructionlist();

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

```

## 事前準備 (3 legged oauth)

1. 2 legged oauthと同様に、RCDEのサイトでアプリケーションを作成します。
2. rcde上の3-leggedのログイン画面からログインします。（ID/PASSはrcdeを使うときのログインに使っているユーザー情報）

```bash
http://{rcdeのドメイン}/oauth/signIn?response_type=code&client_id={企業アプリケーション画面のクライアントID}&scope=all
# ※日本語の部分は必要な値を埋めてください
```

3. 上記ログイン後、企業アプリケーション画面で設定したコールバックURLへリダイレクトされます。
4. コールバックURLのクエリ文字列の`code`に文字列が返ってくるので、その`code`の値を用いて`RCDEClient3Legged`のインスタンスを作成します。

### 使用方法 (3 legged oauth)

```typescript
const client = new RCDEClient3Legged({
  // RCDEのWebサイトのURL e.g. https://api.rcde.jp
  domain,
  // RCDEのアプリ設定画面で登録したドメイン
  baseUrl,
  // コールバックURLのクエリ文字列の`code`の値
  authCode,
});
```

あとの使い方は2 legged oauthとほぼ同様ですが、
作成した現場の認証作業が必要だったり、
rcdeのアプリケーションと同様に、発注者と受注者の関係が前提になっていることに注意が必要です。
