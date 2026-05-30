"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export function toMaandStr(year: number, monthIdx: number): string {
  return `${year}-${String(monthIdx + 1).padStart(2, "0")}`;
}

export function getPrevMaandStr(maand: string): string {
  const [y, m] = maand.split("-").map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
}

export function getCurrentMaandStr(): string {
  const now = new Date();
  return toMaandStr(now.getFullYear(), now.getMonth());
}

type MonthContextType = {
  activeYear: number;
  activeMonthIdx: number;
  activeMaandStr: string;
  isCurrentMonth: boolean;
  setActiveMonth: (year: number, monthIdx: number) => void;
  goToPrev: () => void;
  goToNext: () => void;
};

const _now = new Date();

const MonthContext = createContext<MonthContextType>({
  activeYear: _now.getFullYear(),
  activeMonthIdx: _now.getMonth(),
  activeMaandStr: toMaandStr(_now.getFullYear(), _now.getMonth()),
  isCurrentMonth: true,
  setActiveMonth: () => {},
  goToPrev: () => {},
  goToNext: () => {},
});

export function MonthProvider({ children }: { children: ReactNode }) {
  const now = new Date();
  const [activeYear, setActiveYear] = useState(now.getFullYear());
  const [activeMonthIdx, setActiveMonthIdx] = useState(now.getMonth());

  const activeMaandStr = toMaandStr(activeYear, activeMonthIdx);
  const isCurrentMonth = activeYear === now.getFullYear() && activeMonthIdx === now.getMonth();

  function setActiveMonth(year: number, monthIdx: number) {
    setActiveYear(year);
    setActiveMonthIdx(monthIdx);
  }

  function goToPrev() {
    if (activeMonthIdx === 0) {
      setActiveYear((y) => y - 1);
      setActiveMonthIdx(11);
    } else {
      setActiveMonthIdx((m) => m - 1);
    }
  }

  function goToNext() {
    if (isCurrentMonth) return;
    if (activeMonthIdx === 11) {
      setActiveYear((y) => y + 1);
      setActiveMonthIdx(0);
    } else {
      setActiveMonthIdx((m) => m + 1);
    }
  }

  return (
    <MonthContext.Provider value={{ activeYear, activeMonthIdx, activeMaandStr, isCurrentMonth, setActiveMonth, goToPrev, goToNext }}>
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth() {
  return useContext(MonthContext);
}
