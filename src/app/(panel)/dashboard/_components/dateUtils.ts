const TZ = "America/Sao_Paulo";

export function todayKeyInTz(timeZone = TZ) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const y = parts.find((p) => p.type === "year")!.value;
    const m = parts.find((p) => p.type === "month")!.value;
    const d = parts.find((p) => p.type === "day")!.value;

    return `${y}-${m}-${d}`; // YYYY-MM-DD
}

/**
 * dueDateKey: "YYYY-MM-DD" (como você já usa no TaskUI)
 */
export function isOverdue(dueDateKey: string | null | undefined, completed: boolean) {
    if (!dueDateKey) return false;
    if (completed) return false;

    const today = todayKeyInTz();
    return dueDateKey < today; // comparação lexicográfica funciona em YYYY-MM-DD
}