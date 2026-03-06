import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { requireUser } from "@/lib/requireUser";

function uploadBufferToCloudinary(
    buffer: Buffer,
    options: {
        folder: string;
        public_id: string;
        overwrite?: boolean;
    }
): Promise<{
    secure_url: string;
    public_id: string;
}> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder,
                public_id: options.public_id,
                overwrite: options.overwrite ?? true,
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Upload sem resultado"));
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        stream.end(buffer);
    });
}

export async function POST(req: Request) {
    try {
        const user = await requireUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Envie apenas imagens" }, { status: 400 });
        }

        const maxSizeBytes = 2 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return NextResponse.json({ error: "Imagem deve ter no máximo 2MB" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploaded = await uploadBufferToCloudinary(buffer, {
            folder: "adventurer-route/avatars",
            public_id: `user-${user.id}`,
            overwrite: true,
        });


        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                image: uploaded.secure_url,
            },
            select: {
                id: true,
                image: true,
            },
        });

        return NextResponse.json({
            ok: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Erro ao enviar avatar para Cloudinary:", error);
        return NextResponse.json(
            { error: "Falha ao salvar avatar" },
            { status: 500 }
        );
    }
}

