import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";
import { completeTask } from "@/server/services/tasks/complete-task";

export async function PATCH(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { id: taskId } = await params;
    const result = await completeTask(user.id, taskId);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { ok: _ok, ...body } = result;
    return NextResponse.json(body);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao concluir task" }, { status: 500 });
  }
}