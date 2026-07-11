'use client'

import { useSyncExternalStore } from "react"

function subscribe() { return () => {} }

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
  if (!isClient) return null
  return <>{children}</>
}