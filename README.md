# RCDE API SDK

RCDE APIを使用するためのSDKです。

## インストール方法

npm、またはyarnを使用してインストールします。

```bash
npm install @rcde/api-sdk
# or
yarn add @rcde/api-sdk
```

## 事前準備

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

## 使用方法

```typescript

// APIクライアントの初期化
const client = new RCDEClient({
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