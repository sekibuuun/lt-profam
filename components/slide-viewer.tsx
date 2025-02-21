"use client"

import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface SlideViewerProps {
  pdfContent: string
  onClose: () => void
}

export default function SlideViewer({ pdfContent, onClose }: SlideViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setPageNumber((prev) => Math.max(prev - 1, 1))
      } else if (e.key === "ArrowRight") {
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [numPages])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative"
        >
          <Button variant="outline" size="icon" className="absolute top-2 right-2 z-10" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <Document
            file={`data:application/pdf;base64,${pdfContent}`}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} width={800} />
          </Document>
          <div className="mt-4 flex justify-between items-center">
            <Button
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> 前へ
            </Button>
            <span className="text-indigo-700">
              {pageNumber} / {numPages}
            </span>
            <Button
              onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
              disabled={pageNumber >= (numPages || 1)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              次へ <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <Button className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <>
                <Minimize className="h-4 w-4 mr-2" /> フルスクリーン解除
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4 mr-2" /> フルスクリーン
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

