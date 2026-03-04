"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type MeApi = {
    level: number;
    xp: number;
    life: number;
    maxLife: number;
    gold: number;
    streakCount: number;
    tasksCompletedTotal: number;
};

type MeContextValue = {
    me: MeApi | null;
    loading: boolean;
    error: string | null;
    reload: () => Promise<void>;
    setMe: React.Dispatch<React.SetStateAction<MeApi | null>>;
};

const MeContext = createContext<MeContextValue | null>(null);

async function fetchMe(): Promise<MeApi> {
    const res = await fetch("/api/me", { cache: "no-store" });
    const json = await res.json().catch(() => null);

    if (!res.ok) throw new Error(json?.error ?? "Falha ao carregar /api/me");
    return json as MeApi;
}

export function MeProvider({ children }: { children: React.ReactNode }) {
    const [me, setMe] = useState<MeApi | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function reload() {
        setError(null);
        try {
            const data = await fetchMe();
            setMe(data);
        } catch (e: any) {
            setError(e?.message ?? "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reload();
    }, []);

    const value = useMemo<MeContextValue>(
        () => ({ me, loading, error, reload, setMe }),
        [me, loading, error]
    );

    return <MeContext.Provider value={value}>{children}</MeContext.Provider>;
}

export function useMe() {
    const ctx = useContext(MeContext);
    if (!ctx) throw new Error("useMe deve ser usado dentro de <MeProvider />");
    return ctx;
}