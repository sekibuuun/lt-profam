"use client"

import { useState } from "react"
import FileUpload  from "@/components/file-upload"
import FileList from "@/components/file-list"
import SlideViewer from "@/components/slide-viewer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { type FileData, updateFileName, deleteFile, saveInvite } from "@/lib/db"
import { motion } from "framer-motion"

interface ClientInvitePageProps {
  initialFiles: FileData[]
  inviteId: number
}

export default function ClientInvitePage({ initialFiles, inviteId }: ClientInvitePageProps) {
  const [files, setFiles] = useState<FileData[]>(initialFiles)
  const [viewingFile, setViewingFile] = useState<FileData | null>(null)

  const handleDelete = async (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    await deleteFile({ id: fileId })
    await saveInvite({ invite: updatedFiles, inviteId })
  }

  const handleRename = async (fileId: string, newName: string) => {
    const updatedFiles = files.map((f) => (f.id === fileId ? { ...f, name: newName } : f))
    setFiles(updatedFiles)
    await updateFileName({ id: fileId, newName })
    await saveInvite({ invite: updatedFiles, inviteId })
  }

  const handleView = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      setViewingFile(file)
    }
  }

  const handleUpload = async (newFile: FileData) => {
    const updatedFiles = [...files, newFile]
    setFiles(updatedFiles)
    await saveInvite({ invite: updatedFiles, inviteId })
  }

  return (
    <main className="max-w-full mx-auto p-4 min-h-screen bg-gradient-to-br from-pink-100 to-blue-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-4xl mx-auto bg-white bg-opacity-70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-pink-400">共有スライド</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload onUpload={handleUpload} />
            <FileList files={files} onDelete={handleDelete} onRename={handleRename} onView={handleView} />
          </CardContent>
        </Card>
      </motion.div>
      {viewingFile && <SlideViewer pdfContent={viewingFile.content || ""} onClose={() => setViewingFile(null)} />}
    </main>
  )
}

