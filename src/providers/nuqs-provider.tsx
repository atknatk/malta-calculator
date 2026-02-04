"use client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function NuqsProvider(props: { children: React.ReactNode }) {
  return <NuqsAdapter>{props.children}</NuqsAdapter>;
}
