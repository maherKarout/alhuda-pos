import React from 'react'
import { Box } from '@mui/material'
import { CasherLoginProvider } from '../providers/casher-login-provider'
import UserSelectionPanel from '../components/user-selection-panel'
import PinEntryKeypad from '../components/pin-entry-keypad'

const CasherLogin = () => {
  return (
    <CasherLoginProvider>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          backgroundColor: '#f8f9fa'
        }}
      >
        {/* Left Side - User Selection */}
        <UserSelectionPanel />

        {/* Right Side - PIN Entry */}
        <PinEntryKeypad />
      </Box>
    </CasherLoginProvider>
  )
}

export default CasherLogin
