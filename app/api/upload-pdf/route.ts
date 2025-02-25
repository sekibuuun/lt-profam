// app/api/upload-pdf/route.ts
import { NextResponse } from 'next/server';
import { insertPDFFile } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { file, inviteCode } = await request.json();
    const result = await insertPDFFile({ file, inviteCode });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('PDF挿入エラー:', error);
    return NextResponse.json(
      { success: false, error: 'PDFの保存に失敗しました' },
      { status: 500 }
    );
  }
}