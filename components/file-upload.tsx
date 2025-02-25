"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileData } from "@/app/types"
import { motion } from "framer-motion"
import { upload } from '@vercel/blob/client'
import { type PutBlobResult } from '@vercel/blob'

interface FileUploadProps {
  onUpload: (fileId: number, newFile: FileData) => Promise<void>
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [blob, setBlob] = useState<PutBlobResult | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setFileName(acceptedFiles[0].name)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return

    try {
      setIsUploading(true)
      
      // ファイル名が設定されていない場合は、元のファイル名を使用
      const uploadFileName = fileName || file.name
      
      // Vercel Blobの公式クライアントアップロード機能を使用
      const newBlob = await upload(uploadFileName, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      
      // BlobResultを保存
      setBlob(newBlob)
      
      // 成功したら、onUploadコールバックを呼び出す
      await onUpload(0, { 
        filename: uploadFileName, 
        content: newBlob.url,
        // 必要に応じて追加のメタデータを含める
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      } as unknown as FileData)
      
      // フォームをリセット
      setFile(null)
      setFileName("")
    } catch (error) {
      console.error('ファイルのアップロードに失敗しました:', error)
    } finally {
      setIsUploading(false)
    }
  }

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
      {file && (
        <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Label htmlFor="fileName" className="text-pink-400">
            ファイル名
          </Label>
          <Input
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
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
      
      {blob && (
        <motion.div 
          className="mt-4 p-3 bg-green-50 text-green-700 rounded-md"
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          アップロード成功: <a href={blob.url} target="_blank" rel="noopener noreferrer" className="underline">ファイルを表示</a>
        </motion.div>
      )}
    </div>
  )
}