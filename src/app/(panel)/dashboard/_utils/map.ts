import type { TaskApi, TaskUI } from "../_types";

export function mapTaskApiToUI(t: TaskApi): TaskUI {
    return {
        id: t.id,
        title: t.title,
        difficulty: t.difficulty,
        dueDate: t.dueDate ? t.dueDate.slice(0, 10) : null,
        completed: t.completed,
        description: null,
        tags: [],
        dayKey: t.dayKey,
    };
}