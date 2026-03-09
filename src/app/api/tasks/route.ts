import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { createTaskSchema } from "@/features/tasks/schemas/task.schema";
import { getFirstZodError } from "@/lib/http/get-first-zod-error";
import { listTasks } from "@/server/services/tasks/get-tasks";
import { createTask } from "@/server/services/tasks/create-task";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const url = new URL(req.url);
    const dayKey = url.searchParams.get("dayKey");

    const tasks = await listTasks(user.id, dayKey);
    return NextResponse.json(tasks);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao listar tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: getFirstZodError(parsed.error) }, { status: 400 });
    }

    const result = await createTask(user.id, parsed.data);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.task, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar task" }, { status: 500 });
  }
}