import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { seedGlobalGameData, seedUserDefaults } from "@/server/game/seed/seed";
import bcrypt from "bcryptjs";

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

                const local = await prisma.localAccount.findUnique({
                    where: { email },
                    select: {
                        hash: true,
                        user: {
                            select: { id: true, email: true, name: true, image: true },
                        },
                    },
                });

                if (!local?.user) return null;

                const ok = await bcrypt.compare(password, local.hash);
                if (!ok) return null;

                return {
                    id: local.user.id,
                    email: local.user.email,
                    name: local.user.name,
                    image: local.user.image,
                };
            },
        }),
    ],

    pages: { signIn: "/login" },

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = (token as any).id;
            }
            return session;
        },

        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const email = user.email?.toLowerCase().trim();
                if (email) {
                    const hasLocal = await prisma.localAccount.findUnique({
                        where: { email },
                        select: { id: true },
                    });
                    if (hasLocal) return "/login?error=EmailJaCadastrado";
                }
            }
            return true;
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
