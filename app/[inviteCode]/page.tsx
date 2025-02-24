import { notFound } from "next/navigation";
import { getInviteId, isValidInvite, getInvite } from "@/lib/db";
import ClientInvitePage from "@/components/ClientInvitePage";

export default async function InvitePage({ params }: { params: { inviteCode: string } }) {
  if (!(await isValidInvite(params.inviteCode))) {
    notFound();
  }
  const id = await getInviteId(params.inviteCode);
  const invite = await getInvite(id);
  return <ClientInvitePage initialFiles={invite.files} inviteId={id}/>;
}
