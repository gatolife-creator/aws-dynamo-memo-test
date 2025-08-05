import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});

const TABLE_NAME = "notes";

async function createNotesTable() {
  try {
    // テーブルが既に存在するかチェック
    try {
      await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
      console.log(`Table ${TABLE_NAME} already exists.`);
      return;
    } catch (error) {
      // テーブルが存在しない場合は作成処理を続行
    }

    const command = new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH", // パーティションキー
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S", // String
        },
      ],
      BillingMode: "PAY_PER_REQUEST", // オンデマンド課金
    });

    const response = await client.send(command);
    console.log("Table created successfully:", response.TableDescription?.TableName);
    console.log("Table ARN:", response.TableDescription?.TableArn);
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

// 環境変数が設定されていない場合の警告
if (!process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY) {
  console.log("Please set ACCESS_KEY_ID and SECRET_ACCESS_KEY in your .env.local file");
  process.exit(1);
}

createNotesTable();
