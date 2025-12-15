import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tools = [
  { name: "Nextcloud", description: "File Cloud", url: "https://files.guardianoverride.com", icon: "cloud", category: "Core" },
  { name: "Wiki.js", description: "Knowledge Base", url: "https://docs.guardianoverride.com", icon: "book", category: "Core" },
  { name: "Excalidraw", description: "Whiteboard / Diagrams", url: "https://studio.guardianoverride.com", icon: "pen", category: "Core" },
  { name: "Planka", description: "Project Management", url: "https://projects.guardianoverride.com", icon: "layout", category: "Core" },
  { name: "Strapi", description: "Headless CMS / API", url: "https://api.guardianoverride.com", icon: "database", category: "Core", adminOnly: true },
  { name: "Windmill", description: "Workflows & Automation", url: "https://ops.guardianoverride.com", icon: "workflow", category: "Ops", adminOnly: true },
  { name: "Umami", description: "Analytics", url: "https://metrics.guardianoverride.com", icon: "bar-chart", category: "Ops", adminOnly: true },
  { name: "Authentik", description: "SSO / Identity", url: "https://auth.guardianoverride.com", icon: "shield", category: "Ops", adminOnly: true },
  { name: "Infisical", description: "Secrets Manager", url: "https://env.guardianoverride.com", icon: "key", category: "Ops", adminOnly: true },
  { name: "GlitchTip", description: "Error & Exception Tracking", url: "https://audit.guardianoverride.com", icon: "bug", category: "Ops", adminOnly: true },
  { name: "Portainer", description: "Docker / Container UI", url: "https://compute.guardianoverride.com", icon: "box", category: "Ops", adminOnly: true },
  { name: "Uptime Kuma", description: "Uptime & Status", url: "https://status.guardianoverride.com", icon: "activity", category: "Ops", adminOnly: true }
];

async function main() {
  for (const t of tools) {
    await prisma.tool.upsert({
      where: { id: t.id ?? "___nope___" },
      create: {
        name: t.name,
        description: t.description,
        url: t.url,
        icon: t.icon,
        category: t.category,
        adminOnly: !!t.adminOnly
      },
      update: {}
    }).catch(async () => {
      // fallback unique is not id; just create if doesn't exist by name+url
      const existing = await prisma.tool.findFirst({ where: { name: t.name, url: t.url } });
      if (!existing) {
        await prisma.tool.create({ data: {
          name: t.name,
          description: t.description,
          url: t.url,
          icon: t.icon,
          category: t.category,
          adminOnly: !!t.adminOnly
        }});
      }
    });
  }
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
