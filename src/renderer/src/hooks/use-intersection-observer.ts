import { useEffect, useRef, useState } from 'react'

type UseIntersectionObserverProps = IntersectionObserverInit

export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0
}: UseIntersectionObserverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  const isIntersecting = entry?.isIntersecting ?? false

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry)
      },
      { root, rootMargin, threshold }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [root, rootMargin, threshold])

  return { ref, entry, isIntersecting }
}
