import { getFiles } from "@/lib/db";
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