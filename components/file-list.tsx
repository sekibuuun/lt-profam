"use client"

import { useState } from "react"
import type { FileData } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, X, Check, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FileListProps {
  files: FileData[]
  onDelete: (fileId: string) => void
  onRename: (fileId: string, newName: string) => void
  onView: (fileId: string) => void
}

export default function FileList({ files, onDelete, onRename, onView }: FileListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const startEditing = (file: FileData) => {
    setEditingId(file.id)
    setEditingName(file.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName("")
  }

  const saveEditing = (fileId: string) => {
    onRename(fileId, editingName)
    setEditingId(null)
    setEditingName("")
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-pink-400">アップロードされたファイル</h2>
      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow mb-2"
          >
            {editingId === file.id ? (
              <div className="flex items-center space-x-2 flex-grow">
                <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="flex-grow" />
                <Button
                  size="icon"
                  onClick={() => saveEditing(file.id)}
                  className="bg-green-300 hover:bg-green-400 text-white"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-grow text-gray-600">{file.name}</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onView(file.id)}
                    className="text-blue-400 hover:text-blue-500"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => startEditing(file)}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onDelete(file.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

