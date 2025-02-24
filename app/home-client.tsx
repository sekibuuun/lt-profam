"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { motion } from "framer-motion"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function HomeClient({ createInviteAction }: { createInviteAction: () => Promise<string> }) {
  const [inviteUrl, setInviteUrl] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const generateInviteUrl = async () => {
    const inviteCode = await createInviteAction();
    const url = `${window.location.origin}/${inviteCode}`
    setInviteUrl(url)
    setIsCopied(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setIsCopied(true)
      toast({
        title: "URLをコピーしました",
        description: "クリップボードにURLが保存されました。",
        duration: 3000,
      })
      setTimeout(() => setIsCopied(false), 3000)
    } catch (err) {
      console.log(err);
      toast({
        title: "コピーに失敗しました",
        description: "URLのコピーに失敗しました。もう一度お試しください。",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <main className="max-w-full mx-auto p-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md bg-white bg-opacity-70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-pink-400">LT スライドシェア</CardTitle>
            <CardDescription className="text-center text-blue-400">簡単にスライドを共有しましょう</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">招待URLを生成して、チームメンバーとスライドを共有しましょう。</p>
            <div className="flex space-x-2">
              <Input readOnly value={inviteUrl} placeholder="ここに招待URLが表示されます" className="bg-white" />
              <Button
                onClick={inviteUrl ? copyToClipboard : generateInviteUrl}
                className={`${inviteUrl ? "bg-green-300 hover:bg-green-400" : "bg-blue-300 hover:bg-blue-400"} text-white`}
              >
                {inviteUrl ? (isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />) : null}
                {inviteUrl ? (isCopied ? "コピー済み" : "URLをコピー") : "URLを生成"}
              </Button>
            </div>
          </CardContent>
          {inviteUrl && (
            <CardFooter>
              <p className="text-sm text-pink-400">
                このURLを共有して、PDFスライドのアップロードと閲覧を許可しましょう。
              </p>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </main>
  )
}
