import { useEffect, useState } from "react";
import { getSeeds, type SeedsData } from "../services/seeds";
import { getLevel, getProgressPct, seedsToNextLevel, getNextLevel, type Level } from "../data/levels";

export interface SeedsState {
  total: number;
  lifetimeEarned: number;
  todayEarned: number;
  weekEarned: number;
  transactions: SeedsData["transactions"];
  currentLevel: Level;
  progressPct: number;
  seedsToNext: number;
  nextLevel: Level | null;
  /** ISO date strings (YYYY-MM-DD) on which the user earned any seeds — last 28 days */
  activeDays: Set<string>;
  loading: boolean;
}

const DEFAULT: SeedsState = {
  total: 0, lifetimeEarned: 0, todayEarned: 0, weekEarned: 0,
  transactions: [], currentLevel: getLevel(0), progressPct: 0,
  seedsToNext: 100, nextLevel: getNextLevel(0), activeDays: new Set(),
  loading: true,
};

function getMondayISO(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function getTodayISO(): string { return new Date().toISOString().slice(0, 10); }

export function useSeeds(): SeedsState {
  const [state, setState] = useState<SeedsState>(DEFAULT);

  useEffect(() => {
    getSeeds()
      .then((data) => {
        const today = getTodayISO();
        const monday = getMondayISO();
        let todayEarned = 0;
        let weekEarned = 0;
        const activeDays = new Set<string>();

        for (const tx of data.transactions) {
          const d = tx.createdAt.slice(0, 10);
          if (tx.amount > 0) {
            activeDays.add(d);
            if (d === today) todayEarned += tx.amount;
            if (d >= monday) weekEarned += tx.amount;
          }
        }

        setState({
          total: data.total,
          lifetimeEarned: data.lifetimeEarned,
          todayEarned,
          weekEarned,
          transactions: data.transactions,
          currentLevel: getLevel(data.total),
          progressPct: getProgressPct(data.total),
          seedsToNext: seedsToNextLevel(data.total),
          nextLevel: getNextLevel(data.total),
          activeDays,
          loading: false,
        });
      })
      .catch(() => setState((s) => ({ ...s, loading: false })));
  }, []);

  return state;
}
