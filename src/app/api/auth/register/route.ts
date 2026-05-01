import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { seedGlobalGameData, seedUserDefaults } from "@/server/game/seed/seed";
import { registerSchema } from "@/features/auth/schemas/auth.schema";
import { ZodError } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "auth");
  if (limited) return limited;
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    const name = parsed.name?.trim() || "";
    const email = parsed.email;
    const password = parsed.password;

    const existingLocal = await prisma.localAccount.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingLocal) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 409 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Esse email já existe. Entre com Google ou faça login." },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    await seedGlobalGameData();

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

    await seedUserDefaults(user.id);

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 }
      );
    }

    console.error(err);
    return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
  }
}