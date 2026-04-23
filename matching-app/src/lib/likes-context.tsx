'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { storage } from './storage'

const INITIAL_LIKES = 100

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

  useEffect(() => {
    setRemaining(storage.getRemainingLikes(INITIAL_LIKES))
  }, [])

  const decrement = () =>
    setRemaining(v => {
      const next = Math.max(0, v - 1)
      storage.setRemainingLikes(next)
      return next
    })

  return (
    <LikesContext.Provider value={{ remaining, decrement }}>
      {children}
    </LikesContext.Provider>
  )
}

export const useLikes = () => useContext(LikesContext)
