import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

function extFromType(type: string) {
    if (type === "image/png") return "png";
    if (type === "image/jpeg") return "jpg";
    if (type === "image/webp") return "webp";
    return null;
}

export async function POST(req: Request) {
    try {
        const user = await requireUser();
        if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

        const form = await req.formData();
        const file = form.get("file");

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "Arquivo 'file' é obrigatório" }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Envie uma imagem" }, { status: 400 });
        }

        const ext = extFromType(file.type);
        if (!ext) {
            return NextResponse.json({ error: "Formato suportado: png, jpg/jpeg, webp" }, { status: 400 });
        }

        const maxBytes = 2 * 1024 * 1024;
        if (file.size > maxBytes) {
            return NextResponse.json({ error: "Imagem muito grande (máx 2MB)" }, { status: 400 });
        }

        const bytes = Buffer.from(await file.arrayBuffer());

        const dir = path.join(process.cwd(), "public", "avatars");
        await fs.mkdir(dir, { recursive: true });

        const filename = `${user.id}-${Date.now()}.${ext}`;
        const filepath = path.join(dir, filename);

        await fs.writeFile(filepath, bytes);

        const url = `/avatars/${filename}`;

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { image: url },
            select: { id: true, image: true, name: true, email: true },
        });

        return NextResponse.json({ user: updated });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao atualizar avatar" }, { status: 500 });
    }
}