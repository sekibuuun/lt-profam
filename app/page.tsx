import { createInvite } from "@/lib/db"
import HomeClient from "./home-client"

// サーバーコンポーネントとして動作するHomePageコンポーネント
export default function HomePage() {
  async function createInviteAction() {
    "use server";
    return await createInvite();
  }
  return <HomeClient createInviteAction={createInviteAction} />
}
