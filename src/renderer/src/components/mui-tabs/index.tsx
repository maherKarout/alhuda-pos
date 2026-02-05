import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import React from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mui-tabpanel-${index}`}
      aria-labelledby={`mui-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export function a11yProps(index: number) {
  return {
    id: `mui-tab-${index}`,
    'aria-controls': `mui-tabpanel-${index}`
  }
}

interface TabItem {
  label: string
  content: React.ReactNode

}

interface MuiTabsProps {
  tabs: TabItem[]
  ariaLabel?: string
  defaultTab?: number
  onTabChange?: (newValue: number) => void
}

export function MuiTabs({
  tabs,
  ariaLabel = 'mui tabs',
  defaultTab = 0,
  onTabChange
}: MuiTabsProps) {
  const { t } = useTranslation('translation')
  const [value, setValue] = useState(defaultTab)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    onTabChange?.(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label={ariaLabel}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={t(tab.label)} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      <TabPanel value={value} index={value}>
        {tabs[value]?.content}
      </TabPanel>
    </Box>
  )
}

export default MuiTabs
