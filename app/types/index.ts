export type Invite = {
  id: number;
  code: string;
  used: boolean;
  createdAt: string;
};
export type FileData = {
  id: number;
  filename: string;
  uploadedAt: string;
  inviteId: number;
};