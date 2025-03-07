import { PutBlobResult } from "@vercel/blob";

export type Invite = {
  id: number;
  code: string;
  used: boolean;
  createdAt: string;
};
export type FileData = {
  id: number;
  name: string;
  url: string;
  uploadedAt: string;
  inviteId: number;
};
export type FileState = {
  file: File | null;           // 選択されたファイルオブジェクト
  name: string;                // ファイル名
  blobResult: PutBlobResult | null; // アップロード後のBlobの結果
  isUploaded: boolean;         // アップロード完了フラグ
}
