import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { updateTaskSchema } from "@/features/tasks/schemas/task.schema";
import { getFirstZodError } from "@/lib/http/get-first-zod-error";
import { updateTask } from "@/server/services/tasks/update-task";
import { deleteTask } from "@/server/services/tasks/delete-task";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateUuid } from "@/lib/http/validate-uuid";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const limited = await checkRateLimit(req, "write");
  if (limited) return limited;

  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const rawId = (await params).id;
    const validated = validateUuid(rawId);
    if ("error" in validated) return validated.error;
    const { id } = validated;
    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: getFirstZodError(parsed.error) }, { status: 400 });
    }

    const result = await updateTask(user.id, id, parsed.data);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.task);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao atualizar task" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const limited = await checkRateLimit(req, "write");
  if (limited) return limited;

  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const rawId = (await params).id;
    const validated = validateUuid(rawId);
    if ("error" in validated) return validated.error;
    const { id } = validated;
    const result = await deleteTask(user.id, id);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao deletar task" }, { status: 500 });
  }
}