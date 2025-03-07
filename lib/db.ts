/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/db/drizzle';
import { files, invites } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { FileData, FileState } from "@/app/types"

export async function insertPDFFile({ file, inviteCode }: { file: FileState; inviteCode: string }) {
  const inviteId = await getInviteId(inviteCode);
  return await db.insert(files).values({
    url: file.blobResult?.url as string,
    name: file.blobResult?.pathname as string,
    uploadedAt: new Date().toISOString(),
    inviteId,
  })
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
  if (!invite.length) {
    throw new Error(`Invite code "${code}" not found`);
  }
  return invite[0].id;
}

export async function isValidInvite(code: string): Promise<boolean> {
  const invite = await db.select()
    .from(invites)
    .where(eq(invites.code, code))
    .limit(1);

  return invite.length > 0;
}



export async function updateFileName({ id, newName }: { id: number; newName: string }): Promise<void> {
  void id;
  void newName;
  // ダミー実装: ファイル名を更新する処理
}

export async function deleteFile({ id }: { id: number }): Promise<void> {
  void id;
  // ダミー実装: ファイルを削除する処理
}

export async function saveInvite({ id }: { id: number }): Promise<void> {
  void id;
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
  }).returning();

  const code = result[0]?.code;

  if (!code) {
    throw new Error('Failed to create invite code');
  }

  return code;
}

export async function getFiles(code: string): Promise<FileData[]> {
  const inviteId = await getInviteId(code);
  const result = await db.select()
    .from(files)
    .where(eq(files.inviteId, inviteId))

  return result;
}
