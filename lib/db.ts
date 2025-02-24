/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/db/drizzle';
import { invites } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

/**
 * PDFファイルをDBに保存する関数
 * 注意: 保存先のテーブル "pdf_files" は事前に作成しておく必要があります。
 * Neon DBを使用して接続しています。
 */
export async function insertPDFFile({ fileName, data, uploadedAt }: { fileName: string; data: Buffer; uploadedAt: Date; }) {
  return await db.insert("pdf_files" as any).values({
    fileName,
    data,
    uploadedAt,
  });
}

// 以下は他の関数のダミー実装です

export async function getInvite(id: number): Promise<{ id: number; files: FileData[] }> {
  // ダミー実装: filesプロパティを追加
  return { id, files: [] };
}

export async function getInviteId(code: string): Promise<number> {
  const invite = await db.select()
    .from(invites)
    .where(eq(invites.code, code))
    .limit(1);
  return invite[0].id
}

export async function isValidInvite(code: string): Promise<boolean> {
  const invite = await db.select()
    .from(invites)
    .where(eq(invites.code, code))
    .limit(1);

  return invite.length > 0;
}

export type FileData = {
  id: string;
  name: string;
  data?: Buffer;
  uploadedAt: Date;
  content?: string;
};

export async function updateFileName({ id, newName }: { id: string; newName: string }): Promise<void> {
  void id;
  void newName;
  // ダミー実装: ファイル名を更新する処理
}

export async function deleteFile({ id }: { id: string }): Promise<void> {
  void id;
  // ダミー実装: ファイルを削除する処理
}

export async function saveInvite({ invite, inviteId }: { invite: FileData[]; inviteId: number }): Promise<void> {
  void inviteId;
  void invite;
  // ダミー実装: 招待情報を保存する処理
};

/**
 * invitesテーブルは、生成された招待コード（URL情報）を管理します。
 * テーブルの定義:
 * export const invites = pgTable("invites", {
 *   id: integer("id").primaryKey(),
 *   code: text("code").notNull(),
 *   used: boolean("used").default(false).notNull(),
 *   createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
 * });
 */
export type Invite = {
  id: number;
  code: string;
  used: boolean;
  createdAt: string;
};

/**
 * 新たに招待情報を作成する関数
 * 注意: 保存先のテーブル "invites" は事前に作成しておく必要があります。
 * この関数は、新しい招待コードを自動生成し、データベースに登録した後、
 * 挿入した結果の code の部分を返します。
 */
export async function createInvite(): Promise<string> {
  const result = await db.insert(invites).values({
    code: uuidv4(),
    createdAt: new Date().toISOString(),
  }).returning({ code: invites.code });  // 明示的にcodeカラムを指定

  // resultが配列の場合は最初の要素を取得
  const firstResult = Array.isArray(result) ? result[0] : result;

  if (!firstResult?.code) {
    throw new Error('Failed to create invite code');
  }

  return firstResult.code;
}
