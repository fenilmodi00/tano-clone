"use client";
import { useEffect, useState } from "react";
export function Test() {
  const [n, setN] = useState(0);
  useEffect(() => {
    document.documentElement.setAttribute("data-dev-ready", "1");
    console.log("DEV CLIENT READY");
  }, []);
  return <button onClick={() => setN(n + 1)}>count {n}</button>;
}
