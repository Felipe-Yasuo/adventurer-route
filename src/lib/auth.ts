import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { seedGlobalGameData, seedUserDefaults } from "@/lib/game/seed";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),

        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                const email = (credentials?.email ?? "").trim().toLowerCase();
                const password = credentials?.password ?? "";

                if (!email || !password) return null;

                // ✅ busca a conta local + user
                const local = await prisma.localAccount.findUnique({
                    where: { email },
                    select: {
                        hash: true,
                        user: {
                            select: { id: true, name: true, email: true, image: true },
                        },
                    },
                });

                if (!local) return null;

                const ok = await bcrypt.compare(password, local.hash);
                if (!ok) return null;

                return {
                    id: local.user.id,
                    name: local.user.name,
                    email: local.user.email,
                    image: local.user.image,
                };
            },
        }),
    ],

    pages: { signIn: "/login" },

    session: { strategy: "database" },

    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                (session.user as any).id = user.id;
            }
            return session;
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (url.startsWith(baseUrl)) return url;
            return `${baseUrl}/dashboard`;
        },
    },

    events: {
        async createUser({ user }) {
            await seedGlobalGameData();
            await seedUserDefaults(user.id);
        },
    },
};