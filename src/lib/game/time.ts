const TZ = "America/Sao_Paulo";

export function dateKeyInTz(date: Date, timeZone = TZ) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);

    const y = parts.find((p) => p.type === "year")!.value;
    const m = parts.find((p) => p.type === "month")!.value;
    const d = parts.find((p) => p.type === "day")!.value;

    return `${y}-${m}-${d}`; // ex: 2026-02-26
}

export function diffDaysByDateKey(a: string, b: string) {
    const [ay, am, ad] = a.split("-").map(Number);
    const [by, bm, bd] = b.split("-").map(Number);

    const aUtc = Date.UTC(ay, am - 1, ad);
    const bUtc = Date.UTC(by, bm - 1, bd);

    const ms = bUtc - aUtc;
    return Math.floor(ms / (24 * 60 * 60 * 1000));
}

export function todayKey(timeZone = TZ) {
    return dateKeyInTz(new Date(), timeZone);
}

export function yesterdayKey(timeZone = TZ) {
    const now = new Date();
    const key = dateKeyInTz(now, timeZone);

    const [y, m, d] = key.split("-").map(Number);
    const utc = new Date(Date.UTC(y, m - 1, d));
    utc.setUTCDate(utc.getUTCDate() - 1);
    return dateKeyInTz(utc, "UTC");
}


export function startOfWeekKey(timeZone = TZ) {

    const now = new Date();
    const today = dateKeyInTz(now, timeZone);
    const [y, m, d] = today.split("-").map(Number);

    const utc = new Date(Date.UTC(y, m - 1, d));
    const day = utc.getUTCDay();

    const diffToMonday = (day + 6) % 7;

    utc.setUTCDate(utc.getUTCDate() - diffToMonday);


    return dateKeyInTz(utc, "UTC");
}