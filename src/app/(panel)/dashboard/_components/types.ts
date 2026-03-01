export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type TaskUI = {
  id: string;
  title: string;
  description?: string | null;
  difficulty: Difficulty;
  dueDate?: string | null; // ISO (ex: 2026-02-28)
  completed: boolean;
  tags: string[];
};