"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="w-full max-w-full p-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md bg-white bg-opacity-70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-pink-400">ページが見つかりません</CardTitle>
          </CardHeader>
          <CardContent className="text-center" aria-live="polite">
            <p className="text-lg text-gray-600 mb-4">
              申し訳ありませんが、お探しのページは存在しないか、移動した可能性があります。
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" passHref>
                <Button className="bg-blue-300 hover:bg-blue-400 text-white">
                  <Home className="mr-2 h-4 w-4" />
                  ホームに戻る
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

