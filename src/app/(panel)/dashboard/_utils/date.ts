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

    return `${y}-${m}-${d}`;
}


export function isOverdue(dueDateKey: string | null | undefined, completed: boolean) {
    if (!dueDateKey) return false;
    if (completed) return false;

    const today = todayKeyInTz();
    return dueDateKey < today;
}

export function dateStatus(dueDateKey: string | null | undefined, completed: boolean) {
    if (!dueDateKey || completed) return "normal";

    const today = todayKeyInTz();

    if (dueDateKey < today) return "overdue";
    if (dueDateKey === today) return "today";

    const tomorrow = new Date(today);
    tomorrow.setDate(new Date(today).getDate() + 1);
    const tomorrowKey = tomorrow.toISOString().slice(0, 10);

    if (dueDateKey === tomorrowKey) return "tomorrow";

    return "normal";
}

export function todayKeyLocal() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}