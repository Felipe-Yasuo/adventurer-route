import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { completeTask } from "@/server/services/tasks/complete-task";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateUuid } from "@/lib/http/validate-uuid";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = await checkRateLimit(req, "write");
  if (limited) return limited;

  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const rawId = (await params).id;
    const validated = validateUuid(rawId);
    if ("error" in validated) return validated.error;
    const { id: taskId } = validated;
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