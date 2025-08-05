import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

// DynamoDBクライアントの設定
const client = new DynamoDBClient({
  region: process.env.REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "notes";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ノートを作成
export async function createNote(title: string, content: string): Promise<Note> {
  const note: Note = {
    id: uuidv4(),
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: note,
  });

  await docClient.send(command);
  return note;
}

// 全てのノートを取得
export async function getAllNotes(): Promise<Note[]> {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });

  const response = await docClient.send(command);
  return (response.Items as Note[]) || [];
}

// ノートを更新
export async function updateNote(id: string, title: string, content: string): Promise<Note> {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET title = :title, content = :content, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":title": title,
      ":content": content,
      ":updatedAt": new Date().toISOString(),
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);
  return response.Attributes as Note;
}

// ノートを削除
export async function deleteNote(id: string): Promise<void> {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });

  await docClient.send(command);
}
