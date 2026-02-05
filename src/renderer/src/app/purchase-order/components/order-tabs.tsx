import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Box, IconButton, Button } from '@mui/material'
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import usePurchaseOrder, { initPurchaseOrderState } from '../hooks/use-purchase-order'

export default function OrderTabs() {
  const { t } = useTranslation('translation')
  const { orders, currentOrder, setCurrentOrder, setOrders } = usePurchaseOrder()
  if (!setCurrentOrder || !setOrders) return null

  const [tabs, setTabs] = useState([{ label: t('Order') + ' 1', id: 0 }])

  // Calculate dynamic tab width based on number of tabs
  const getTabWidth = () => {
    const containerWidth = 800 // Approximate container width
    const addButtonWidth = 50
    const availableWidth = containerWidth - addButtonWidth
    const maxTabWidth = 240
    const minTabWidth = 120

    if (tabs.length === 0) return maxTabWidth

    const calculatedWidth = availableWidth / tabs.length
    return Math.max(minTabWidth, Math.min(maxTabWidth, calculatedWidth))
  }

  // Sync tabs with orders
  useEffect(() => {
    if (orders.length > 0) {
      const newTabs = orders.map((_, index) => ({
        label: `${t('Order')} ${index + 1}`,
        id: index
      }))
      setTabs(newTabs)
    }
  }, [orders])

  const handleChange = (event, newValue) => {
    setCurrentOrder(newValue)
  }

  const handleAddTab = () => {
    const newOrder = initPurchaseOrderState.orders[0]
    setOrders((prevOrders) => [...prevOrders, newOrder])
    setCurrentOrder(orders.length) // Switch to the new tab
  }

  const handleCloseTab = (event, tabId) => {
    event.stopPropagation()

    // Don't allow closing if it's the last tab
    if (tabs.length <= 1) return

    // Remove the order from the state
    setOrders((prevOrders) => prevOrders.filter((_, index) => index !== tabId))

    // Adjust current tab if necessary
    if (currentOrder === tabId) {
      if (tabId === tabs.length - 1) {
        // If closing the last tab, switch to the previous one
        setCurrentOrder(Math.max(0, tabId - 1))
      } else {
        // If closing a middle tab, keep the same index (which will now point to the next tab)
        setCurrentOrder(tabId)
      }
    } else if (currentOrder > tabId) {
      // If closing a tab before the current one, adjust the current index
      setCurrentOrder(currentOrder - 1)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        // backgroundColor: '#e8eaed',
        // borderBottom: '1px solid #dadce0',
        height: '36px',
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative'
      }}
    >
      {/* Tabs Container */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {tabs.map((tab, index) => {
          const isActive = currentOrder === tab.id
          const tabWidth = getTabWidth()

          return (
            <Box
              key={tab.id}
              onClick={() => setCurrentOrder(tab.id)}
              sx={{
                position: 'relative',
                height: '100%',
                width: `${tabWidth}px`,
                cursor: 'pointer',
                zIndex: isActive ? 1 : 1,
                marginLeft: index > 0 ? '-1px' : '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Rounded top corners like Chrome
                borderRadius: '8px 8px 0 0',
                backgroundColor: isActive ? '#fff' : 'transparent',
                // border: isActive ? '1px solid #dadce0' : 'none',
                // borderBottom: isActive ? '1px solid #fff' : 'none',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)'
                },
                '&:before': isActive
                  ? {
                      content: '""',
                      position: 'absolute',
                      bottom: '-2px',
                      left: '0px',
                      right: '0px',
                      height: 'px',
                      backgroundColor: '#fff',
                      zIndex: 2
                    }
                  : {}
              }}
            >
              {/* Tab Content */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                {/* Blue indicator dot */}
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#1a73e8',
                    borderRadius: '50%',
                    marginRight: '8px'
                  }}
                />

                {/* Tab Label */}
                <Box
                  sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: isActive ? '#202124' : '#5f6368',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}
                >
                  {tab.label}
                </Box>

                {/* Close Button */}
                {tabs.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={(event) => handleCloseTab(event, tab.id)}
                    sx={{
                      padding: '4px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'transparent',
                      borderRadius: '50%',
                      marginLeft: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(95, 99, 104, 0.1)'
                      }
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14, color: '#5f6368' }} />
                  </IconButton>
                )}
              </Box>
            </Box>
          )
        })}
      </Box>

      {/* Add New Tab Button - Fixed at the end */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          paddingRight: '12px'
          // backgroundColor: '#e8eaed'
        }}
      >
        <IconButton
          onClick={handleAddTab}
          sx={{
            width: '24px',
            height: '24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'rgba(95, 99, 104, 0.1)'
            }
          }}
        >
          <AddIcon sx={{ fontSize: 16, color: '#5f6368' }} />
        </IconButton>
      </Box>
    </Box>
  )
}
