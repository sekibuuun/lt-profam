import { notFound } from "next/navigation";
import { isValidInvite } from "@/lib/db";
import ClientInvitePage from "@/components/ClientInvitePage";

export default async function InvitePage({ params }: { params: { inviteCode: string } }) {
  if (!(await isValidInvite(params.inviteCode))) {
    notFound();
  }
  return <ClientInvitePage/>;
}
