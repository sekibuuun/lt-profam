'use client';

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileData, FileState } from "@/app/types"
import { motion } from "framer-motion"
import { upload } from '@vercel/blob/client'

interface FileUploadProps {
  inviteCode: string,
  onUpload: (fileId: number, newFile: FileData) => Promise<void>
}

export default function FileUpload({ inviteCode, onUpload }: FileUploadProps) {
  // 状態を統一して管理
  const [fileState, setFileState] = useState<FileState>({
    file: null,
    blobResult: null,
    isUploaded: false
  });
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      // ファイルが選択された時に状態を更新
      setFileState({
        file: acceptedFiles[0],
        blobResult: null,
        isUploaded: false
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!fileState.file) return;

    try {
      setIsUploading(true);
      // ファイル名が設定されていない場合は、元のファイル名を使用
      const uploadFileName = fileState.file.name;
      // Vercel Blobの公式クライアントアップロード機能を使用
      const newBlob = await upload(uploadFileName, fileState.file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      // データベース操作をAPI経由で実行
      await fetch('/api/upload-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: {
            ...fileState,
            blobResult: newBlob
          },
          inviteCode
        }),
    });
      // アップロード成功時に状態を更新
      setFileState({
        file: fileState.file,
        blobResult: newBlob,
        isUploaded: true
      });
      // 成功したら、onUploadコールバックを呼び出す
      await onUpload(0, {
        filename: uploadFileName,
        content: newBlob.url,
        size: fileState.file.size,
        type: fileState.file.type,
        uploadedAt: new Date().toISOString()
      } as unknown as FileData);
      // アップロード完了後に入力をリセット
      setFileState({
        file: null,
        blobResult: newBlob,
        isUploaded: true
      });
    } catch (error) {
      console.error('ファイルのアップロードに失敗しました:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileNameChange = () => {
    setFileState({
      ...fileState,
    });
  };

  const rawProps = getRootProps();
  const cleanProps: Omit<typeof rawProps, 'onDrag' | 'onAnimationStart' | 'onDragEnd' | 'onDragStart'> = { ...rawProps };
  delete cleanProps.onDrag;
  delete cleanProps.onAnimationStart;
  delete cleanProps.onDragEnd;
  delete cleanProps.onDragStart;

  return (
    <div className="space-y-4">
      <motion.div
        {...cleanProps}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-pink-300 bg-pink-50" : "border-blue-200"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-pink-400">ここにPDFファイルをドロップ...</p>
        ) : (
          <p className="text-blue-400">PDFファイルをドラッグ＆ドロップ、またはクリックしてファイルを選択</p>
        )}
      </motion.div>
      {fileState.file && (
        <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Label htmlFor="fileName" className="text-pink-400">
            ファイル名
          </Label>
          <Input
            id="fileName"
            value={fileState.file.name}
            onChange={handleFileNameChange}
            placeholder="ファイル名を入力"
            className="bg-white"
          />
          <Button 
            onClick={handleUpload} 
            className="w-full bg-blue-300 hover:bg-blue-400 text-white"
            disabled={isUploading}
          >
            {isUploading ? "アップロード中..." : "アップロード"}
          </Button>
        </motion.div>
      )}
    </div>
  );
}