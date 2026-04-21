'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

const INITIAL_LIKES = 131

interface LikesContextType {
  remaining: number
  decrement: () => void
}

const LikesContext = createContext<LikesContextType>({
  remaining: INITIAL_LIKES,
  decrement: () => {},
})

export function LikesProvider({ children }: { children: ReactNode }) {
  const [remaining, setRemaining] = useState(INITIAL_LIKES)
  const decrement = () => setRemaining(v => Math.max(0, v - 1))
  return (
    <LikesContext.Provider value={{ remaining, decrement }}>
      {children}
    </LikesContext.Provider>
  )
}

export const useLikes = () => useContext(LikesContext)
