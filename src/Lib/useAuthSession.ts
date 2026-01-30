"use client";

import { useEffect, useState } from "react";

type SessionState = {
  role: string | null;
  isGuest: boolean;
  loading: boolean;
};

export const useAuthSession = (): SessionState => {
  const [state, setState] = useState<SessionState>({
    role: null,
    isGuest: false,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) throw new Error("unauthorized");
        const data = await res.json();
        if (!mounted) return;
        setState({
          role: data.role || null,
          isGuest: data.role === "guest",
          loading: false,
        });
      } catch {
        if (!mounted) return;
        setState({ role: null, isGuest: false, loading: false });
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return state;
};
