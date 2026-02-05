import React, { useState, useRef, useEffect } from 'react'

const SafeScannerForm = ({ onChange }: { onChange: (value: string) => void }) => {
  const [serialNumber, setSerialNumber] = useState('')
  const serialInputRef = useRef<HTMLInputElement>(null)
  const bufferRef = useRef('')
  const lastTimeRef = useRef(Date.now())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const now = Date.now()
      const timeDiff = now - lastTimeRef.current

      // scanner typing is very fast (<100ms between keystrokes)
      const isScanner = timeDiff < 10

      // 🟢 always capture the key
      if (e.key !== 'Enter') {
        bufferRef.current += e.key
      } else {
        // Enter = scanner finished
        if (bufferRef.current.length > 0 && isScanner) {
          setSerialNumber(bufferRef.current)
          if (serialInputRef.current) {
            serialInputRef.current.value = bufferRef.current
          }
          // Call the onChange prop if provided
          if (onChange) {
            onChange(bufferRef.current)
          }
        }
        bufferRef.current = ''
      }

      // 🛑 If it's scanner input, redirect to serial input
      if (isScanner) {
        e.preventDefault()
        if (serialInputRef.current) {
          serialInputRef.current.focus()
        }

        // Clear leaked char from wrong input
        const active = document.activeElement as HTMLInputElement
        if (active && active.tagName === 'INPUT' && active !== serialInputRef.current) {
          active.value = ''
        }
      }

      lastTimeRef.current = now
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [])

  return (
    <input
      ref={serialInputRef}
      placeholder="Serial Number (scan only)"
      style={{ display: 'block', marginBottom: '20px', width: '300px', visibility: 'hidden' }}
      readOnly
      // onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default SafeScannerForm
