import { useEffect, useRef, useCallback } from 'react'

/**
 * Debounced auto-save hook.
 * Calls `saveFn` after `delay`ms of no changes.
 * Also triggers save on Cmd/Ctrl+S.
 *
 * @param data     - The data to watch for changes
 * @param saveFn   - Function called to save (receives false = draft, can be silent)
 * @param delay    - Debounce delay in ms (default 1500)
 */
export function useAutoSave<T>(
  data: T,
  saveFn: (isComplete: boolean) => void,
  delay = 1500
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  // Debounced save on data change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      saveFn(false)
    }, delay)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cmd/Ctrl+S keyboard shortcut
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (timer.current) clearTimeout(timer.current)
        saveFn(false)
      }
    },
    [saveFn]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
