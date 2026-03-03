import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as { name?: string; email?: string; password?: string };

        const name = (body.name ?? "").trim();
        const email = (body.email ?? "").trim().toLowerCase();
        const password = body.password ?? "";

        if (!email || !password) {
            return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "A senha deve ter pelo menos 8 caracteres" }, { status: 400 });
        }

        const existing = await prisma.localAccount.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
        }

        const hash = await bcrypt.hash(password, 10);

        // cria User + LocalAccount juntos
        const user = await prisma.user.create({
            data: {
                name: name || null,
                email,
                localAccount: {
                    create: { email, hash },
                },
            },
            select: { id: true, email: true, name: true },
        });

        return NextResponse.json({ ok: true, user }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
    }
}