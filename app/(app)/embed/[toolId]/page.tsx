import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ALLOW_IFRAME_EMBEDS } from "@/lib/env";
import { EmbedFrame } from "@/ui/embed/EmbedFrame";

export const dynamic = "force-dynamic";

export default async function EmbedPage({ params }: { params: { toolId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const tool = await prisma.tool.findUnique({ where: { id: params.toolId } });
  if (!tool) notFound();
  if (tool.adminOnly && session.user.role !== "ADMIN") redirect("/hub");

  if (!ALLOW_IFRAME_EMBEDS) {
    return (
      <div className="card p-5">
        <h1 className="text-xl font-semibold">Embedding disabled</h1>
        <p className="text-sm opacity-80 mt-2">
          To enable iframe embedding in dev, set <code>ALLOW_IFRAME_EMBEDS=true</code> in <code>.env</code>.
        </p>
      </div>
    );
  }

  return <EmbedFrame title={tool.name} url={tool.embedUrl ?? tool.url} />;
}
