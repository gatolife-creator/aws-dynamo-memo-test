# AWS Database Test - メモアプリ

AWSのDynamoDBを使った最小構成のメモアプリです。

## 機能

- メモの作成、表示、編集、削除
- AWS DynamoDB を使用したデータ永続化
- レスポンシブデザイン

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. AWS設定

`.env.local`ファイルを編集し、AWS の認証情報を設定してください：

```env
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
DYNAMODB_TABLE_NAME=notes
```

### 3. DynamoDBテーブルの作成

```bash
npm run create-table
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリにアクセスできます。

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: AWS DynamoDB
- **AWS SDK**: @aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb

## プロジェクト構造

```
├── app/
│   ├── api/notes/          # API routes
│   ├── page.tsx           # メインページ
│   └── layout.tsx         # レイアウト
├── components/
│   └── NotesApp.tsx       # メインコンポーネント
├── lib/
│   └── dynamodb.ts        # DynamoDB操作関数
├── scripts/
│   └── create-table.ts    # テーブル作成スクリプト
└── .env.local            # 環境変数
```

## 注意事項

- 本番環境では適切なAWS IAMロールとセキュリティ設定を行ってください
- AWS使用料金にご注意ください（DynamoDBは従量課金制です）
