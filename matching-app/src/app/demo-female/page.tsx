'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FemalePage() {
  const router = useRouter()
  useEffect(() => { router.replace('/demo-female/discover') }, [router])
  return null
}
