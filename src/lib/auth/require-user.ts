import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/get-session";

export async function requireUser() {
    const session = await getSession();
    const email = session?.user?.email;

    if (!email) return null;

    const user = await prisma.user.upsert({
        where: { email },
        create: {
            email,
            name: session.user?.name ?? null,
            image: (session.user as any)?.image ?? null,
        },
        update: {
            name: session.user?.name ?? null,
        },
        select: { id: true, email: true },
    });

    return user;
}
