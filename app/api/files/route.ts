import { deleteFile, getFiles, updateFileName } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const inviteCode = searchParams.get("code");
  
  if (!inviteCode) {
    return NextResponse.json({ error: "コードパラメータが必要です" }, { status: 400 });
  }

  try {
    const files = await getFiles(inviteCode);
    return NextResponse.json(files);
  } catch (error) {
    console.error("ファイル取得エラー:", error);
    return NextResponse.json({ error: "ファイルの取得に失敗しました" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const inviteCode = searchParams.get("code");
  const { id, newName } = await request.json();

  if (!inviteCode) {
    return NextResponse.json({ error: "コードパラメータが必要です" }, { status: 400 });
  }

  try {
    const files = await updateFileName({ id, newName });
    return NextResponse.json(files);
  } catch (error) {
    console.error("ファイル名変更エラー:", error);
    return NextResponse.json({ error: "ファイル名の変更に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const inviteCode = searchParams.get("code");
  const { id } = await request.json();

  if (!inviteCode) {
    return NextResponse.json({ error: "コードパラメータが必要です" }, { status: 400 });
  }

  try {
    const files = await deleteFile({ id, inviteCode });
    return NextResponse.json(files);
  } catch (error) {
    console.error("ファイル削除エラー:", error);
    return NextResponse.json({ error: "ファイルの削除に失敗しました" }, { status: 500 });
  }
}