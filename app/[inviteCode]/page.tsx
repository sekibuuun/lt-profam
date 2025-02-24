import { notFound } from "next/navigation";
import { isValidInvite, getFiles } from "@/lib/db";
import ClientInvitePage from "@/components/ClientInvitePage";

export default async function InvitePage({ params }: { params: { inviteCode: string } }) {
  if (!(await isValidInvite(params.inviteCode))) {
    notFound();
  }
  const files = await getFiles(params.inviteCode);
  return <ClientInvitePage initialFiles={files}/>;
}
