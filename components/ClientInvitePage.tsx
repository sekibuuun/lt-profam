"use client"

import { useState, useEffect } from "react"
import FileUpload from "@/components/file-upload"
import FileList from "@/components/file-list"
import SlideViewer from "@/components/slide-viewer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { updateFileName, deleteFile, saveInvite } from "@/lib/db"
import { motion } from "framer-motion"
import { FileData } from "@/app/types"
import { useParams } from "next/navigation"

export default function ClientInvitePage() {
  const params = useParams()
  const inviteCode = params.inviteCode as string
  const [files, setFiles] = useState<FileData[]>([])
  const [viewingFile, setViewingFile] = useState<FileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/files?code=${inviteCode}`)
        
        if (!response.ok) {
          throw new Error('ファイルの取得に失敗しました')
        }
        
        const data = await response.json()
        setFiles(data)
      } catch (error) {
        console.error('ファイル取得エラー:', error)
      } finally {
        setLoading(false)
      }
    }

    if (inviteCode) {
      fetchFiles()
    }
  }, [inviteCode])

  const handleDelete = async (fileId: number) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    await deleteFile({ id: fileId })
    await saveInvite({ id: fileId })
  }

  const handleRename = async (fileId: number, newName: string) => {
    const updatedFiles = files.map((f) => (f.id === fileId ? { ...f, name: newName } : f))
    setFiles(updatedFiles)
    await updateFileName({ id: fileId, newName })
    await saveInvite({ id: fileId })
  }

  const handleView = (fileId: number) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      setViewingFile(file)
    }
  }

  const handleUpload = async (fileId: number, newFile: FileData) => {
    const updatedFiles = [...files, newFile]
    setFiles(updatedFiles)
    await saveInvite({ id: fileId })
  }

  return (
    <main className="max-w-full mx-auto p-4 min-h-screen bg-gradient-to-br from-pink-100 to-blue-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-4xl mx-auto bg-white bg-opacity-70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-pink-400">共有スライド</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="text-center py-4">ファイルを読み込み中...</div>
            ) : (
              <>
                <FileUpload inviteCode={inviteCode} onUpload={handleUpload} />
                <FileList files={files} onDelete={handleDelete} onRename={handleRename} onView={handleView} />
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
      {viewingFile && <SlideViewer pdfContent={viewingFile} onClose={() => setViewingFile(null)} />}
    </main>
  )
}