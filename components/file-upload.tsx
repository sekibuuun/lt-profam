"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FileData } from "@/lib/db"
import { motion } from "framer-motion"

interface FileUploadProps {
  onUpload: (file: FileData) => void
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")

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
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        onUpload({
          id: Date.now().toString(),
          name: fileName,
          content: content.split(",")[1], // Remove data URL prefix
        })
        setFile(null)
        setFileName("")
      }
      reader.readAsDataURL(file)
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
          <Button onClick={handleUpload} className="w-full bg-blue-300 hover:bg-blue-400 text-white">
            アップロード
          </Button>
        </motion.div>
      )}
    </div>
  )
}
