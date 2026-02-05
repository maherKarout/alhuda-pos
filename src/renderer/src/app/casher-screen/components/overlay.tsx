import React from 'react'
import { Box } from '@mui/material'

interface OverlayProps {
  children?: React.ReactNode
  isVisible?: boolean
  onClick?: () => void
}

const OverlayLayer = ({ children, isVisible = true, onClick }: OverlayProps) => {
  if (!isVisible) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}

export default OverlayLayer
