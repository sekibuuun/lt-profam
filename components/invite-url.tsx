import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function InviteUrl() {
  const generateInviteUrl = () => {
    // TODO: Implement invite URL generation logic
    console.log("Generating invite URL")
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Invite URL</h2>
      <div className="flex space-x-2">
        <Input readOnly placeholder="Invite URL will appear here" />
        <Button onClick={generateInviteUrl}>Generate URL</Button>
      </div>
    </div>
  )
}

