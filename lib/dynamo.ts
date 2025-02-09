import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { encrypt as encryptKey, decrypt } from "./crypto";

// プロフィールの型定義を追加
interface Profile {
  id: string;
  clerk_name: string;
  game_name: string;
  game_id: string;
  api_key?: string;
  updated_at?: string;
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export const saveApiKey = async (userId: string, hashedApiKey: string) => {
  const command = new PutCommand({
    TableName: "valorant_api_keys",
    Item: {
      userId,
      hashedApiKey,
      createdAt: new Date().toISOString(),
    },
  });

  await docClient.send(command);
};

// APIキー取得を修正
export const getApiKey = async (userId: string) => {
  try {
    const profile = await getProfile(userId);
    return profile?.api_key || null;
  } catch (error) {
    console.error("Get API Key Error:", error);
    throw error;
  }
};

// APIキーの削除処理を修正
export async function deleteApiKey(userId: string): Promise<boolean> {
  try {
    const profile = await getProfile(userId);
    if (!profile) {
      return false;
    }

    const command = new PutCommand({
      TableName: process.env.AWS_TABLE,
      Item: {
        ...profile,
        api_key: undefined, // APIキーのみを削除
        updated_at: new Date().toISOString(),
      },
    });

    await docClient.send(command);
    return true;
  } catch (error) {
    console.error("Delete API Key Error:", error);
    throw error;
  }
}

// プロフィールの削除処理を修正（データをクリアする形に）
export async function deleteProfile(userId: string): Promise<boolean> {
  try {
    const existingProfile = await getProfile(userId);
    if (!existingProfile) {
      return false;
    }

    const command = new PutCommand({
      TableName: process.env.AWS_TABLE,
      Item: {
        id: userId, // IDのみ保持
        clerk_name: "",
        game_name: "",
        game_id: "",
        api_key: "",
        updated_at: new Date().toISOString(),
      },
    });

    await docClient.send(command);
    return true;
  } catch (error) {
    console.error("Delete Profile Error:", error);
    throw error;
  }
}

// ゲーム名とIDによるプロフィール検索を追加
export async function findProfileByGameInfo(
  gameName: string,
  gameId: string
): Promise<Profile | null> {
  if (!process.env.AWS_TABLE) {
    throw new Error("AWS_TABLE is not defined");
  }

  try {
    const command = new GetCommand({
      TableName: process.env.AWS_TABLE,
      Key: {
        game_name: gameName,
        game_id: gameId,
      },
    });

    const response = await docClient.send(command);
    if (!response.Item) return null;

    return {
      id: response.Item.game_name,
      clerk_name: response.Item.clerk_name,
      game_name: response.Item.game_name,
      game_id: response.Item.game_id,
      api_key: response.Item.api_key
        ? decrypt(response.Item.api_key)
        : undefined,
    };
  } catch (error) {
    console.error("Find Profile Error:", error);
    return null;
  }
}

// データ保存を修正
export async function saveProfile(data: {
  id: string;
  clerk_name: string;
  game_name: string;
  game_id: string;
  api_key: string;
}): Promise<boolean> {
  try {
    // 既存のデータを確認
    const existingProfile = await getProfile(data.id);
    const encryptedApiKey = data.api_key ? encryptKey(data.api_key) : undefined;

    const command = new PutCommand({
      TableName: process.env.AWS_TABLE,
      Item: {
        ...existingProfile, // 既存のデータがあれば保持
        id: data.id, // UUIDを維持
        clerk_name: data.clerk_name,
        game_name: data.game_name,
        game_id: data.game_id,
        ...(encryptedApiKey && { api_key: encryptedApiKey }),
        updated_at: new Date().toISOString(),
      },
    });

    await docClient.send(command);
    return true;
  } catch (error) {
    console.error("Save/Update Error:", error);
    throw error;
  }
}

// プロフィール取得を修正（IDベースの検索）
export async function getProfile(id: string): Promise<Profile | null> {
  if (!process.env.AWS_TABLE) {
    throw new Error("AWS_TABLE is not defined");
  }

  try {
    const command = new GetCommand({
      TableName: process.env.AWS_TABLE,
      Key: { id }, // UUIDをプライマリーキーとして使用
    });

    const response = await docClient.send(command);
    if (!response.Item) return null;

    return {
      id: response.Item.id,
      clerk_name: response.Item.clerk_name,
      game_name: response.Item.game_name,
      game_id: response.Item.game_id,
      api_key: response.Item.api_key
        ? decrypt(response.Item.api_key)
        : undefined,
      updated_at: response.Item.updated_at,
    };
  } catch (error) {
    console.error("Get Error:", error);
    throw error;
  }
}

// updateApiKey関数を修正
export async function updateApiKey(
  userId: string,
  apiKey: string
): Promise<boolean> {
  try {
    const existingData = await getProfile(userId);
    if (!existingData) {
      throw new Error("プロフィールが見つかりません");
    }

    const command = new PutCommand({
      TableName: process.env.AWS_TABLE,
      Item: {
        ...existingData,
        api_key: encryptKey(apiKey),
        updated_at: new Date().toISOString(),
      },
    });

    await docClient.send(command);
    return true;
  } catch (error) {
    console.error("Update API Key Error:", error);
    throw new Error("APIキーの更新に失敗しました");
  }
}
