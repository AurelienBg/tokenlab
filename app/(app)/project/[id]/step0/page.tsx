'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function Step0Redirect() {
  const { id } = useParams() as { id: string }
  const router = useRouter()

  useEffect(() => {
    router.replace(`/project/${id}/module/0`)
  }, [id, router])

  return null
}
