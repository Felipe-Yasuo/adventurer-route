"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { TaskUI } from "@/features/tasks/types";
import { dateStatus } from "@/features/tasks/utils/date";
import AnimatedCheckmark from "@/components/animations/AnimatedCheckmark";
import FloatingText, { type FloatingTextItem } from "@/components/animations/FloatingText";

const DIFFICULTY_META: Record<
  TaskUI["difficulty"],
  { icon: string; label: string }
> = {
  EASY: { icon: "🗡️", label: "Fácil" },
  MEDIUM: { icon: "⚔️", label: "Médio" },
  HARD: { icon: "🐉", label: "Difícil" },
};

function difficultyBadge(difficulty: TaskUI["difficulty"]) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border tracking-wide";

  if (difficulty === "EASY") {
    return `${base} bg-(--color-easy)/15 text-(--color-easy) border-(--color-easy)/40`;
  }

  if (difficulty === "MEDIUM") {
    return `${base} bg-(--color-medium)/15 text-(--color-medium) border-(--color-medium)/40`;
  }

  return `${base} bg-(--color-hard)/15 text-(--color-hard) border-(--color-hard)/40`;
}

function difficultyBorder(difficulty: TaskUI["difficulty"]) {
  if (difficulty === "EASY") return "border-l-(--color-easy)";
  if (difficulty === "MEDIUM") return "border-l-(--color-medium)";
  return "border-l-(--color-hard)";
}

export default function TaskCard({
  task,
  onOpen,
  onComplete,
  onDelete,
  completing,
  showCheckmark,
  floatingItems,
}: {
  task: TaskUI;
  onOpen: () => void;
  onComplete: () => void;
  onDelete: () => void;
  completing?: boolean;
  showCheckmark?: boolean;
  floatingItems?: FloatingTextItem[];
}) {
  const status = dateStatus(task.dueDate, task.completed);

  const titleClass = task.completed
    ? "text-(--color-muted) line-through"
    : "text-(--color-ink)";

  return (
    <motion.div
      layout
      layoutId={`task-${task.id}`}
      initial={{ opacity: 0, x: -16 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: completing ? 0.96 : 1,
      }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className={[
        "relative w-full rounded-xl border border-(--color-border) border-l-4 p-4 transition-colors",
        "bg-(--color-surfaceAlt) hover:bg-(--color-surface)",
        "shadow-(--shadow-card)",
        difficultyBorder(task.difficulty),
      ].join(" ")}
    >
      <AnimatePresence>
        {showCheckmark ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-(--color-bg)/40 backdrop-blur-[1px]"
          >
            <AnimatedCheckmark size={72} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {floatingItems && floatingItems.length > 0 ? (
        <FloatingText items={floatingItems} />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p
            className={[
              "truncate text-[15px] font-semibold tracking-wide",
              titleClass,
            ].join(" ")}
          >
            {task.title}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={difficultyBadge(task.difficulty)}>
              <span aria-hidden>{DIFFICULTY_META[task.difficulty].icon}</span>
              {DIFFICULTY_META[task.difficulty].label}
            </span>
          </div>
        </button>

        <div className="flex flex-col items-end gap-2">
          {status === "overdue" && (
            <span className="mb-1 inline-flex items-center rounded-full border border-(--color-hard)/40 bg-(--color-hard)/15 px-2.5 py-1 text-[11px] font-semibold text-(--color-hard)">
              ⏰ VENCIDA
            </span>
          )}

          {status === "today" && (
            <span className="mb-1 inline-flex items-center rounded-full border border-(--color-gold)/50 bg-(--color-gold)/15 px-2.5 py-1 text-[11px] font-semibold text-(--color-gold)">
              🔥 HOJE
            </span>
          )}

          {status === "tomorrow" && (
            <span className="mb-1 inline-flex items-center rounded-full border border-(--color-easy)/40 bg-(--color-easy)/15 px-2.5 py-1 text-[11px] font-semibold text-(--color-easy)">
              🌅 AMANHÃ
            </span>
          )}

          <div className="text-xs text-(--color-muted)">
            {task.dueDate ? (
              <span className="rounded-lg border border-(--color-border) bg-(--color-bg) px-2.5 py-1">
                📅 {task.dueDate}
              </span>
            ) : (
              <span className="rounded-lg border border-(--color-border) bg-(--color-bg) px-2.5 py-1">
                sem data
              </span>
            )}
          </div>

          {!task.completed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              disabled={!!completing}
              className="rounded-lg border border-(--color-easy)/50 bg-(--color-easy)/15 px-3 py-1.5 text-xs font-semibold text-(--color-easy) transition hover:bg-(--color-easy)/25 disabled:opacity-60"
            >
              {completing ? "Concluindo..." : "Concluir"}
            </button>
          ) : (
            <span className="text-xs font-medium text-(--color-muted)">
              ✅ concluída
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-lg border border-(--color-border) bg-(--color-bg) px-2 py-1 text-xs text-(--color-muted) transition hover:bg-(--color-surface) hover:text-(--color-ink)"
            title="Excluir"
            aria-label="Excluir tarefa"
          >
            🗑️
          </button>
        </div>
      </div>
    </motion.div>
  );
}
