import React from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import Badge from '@mui/material/Badge'
import { useTranslation } from 'react-i18next'

const LanguagesTabWrapper = ({
  ln,
  setLn,
  touched,
  errors
}: {
  ln: string
  setLn: Function
  touched: Record<string, any>
  errors: Record<string, any>
}) => {
  const { t } = useTranslation('translation')
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setLn(newValue)
  }

  const hasError = (lang: string, obj: any): boolean => {
    if (typeof obj !== 'object') {
      return false
    }
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === lang && obj[key]) {
          return true
        }
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          if (hasError(lang, obj[key])) {
            return true
          }
        }
        if (Array.isArray(obj[key])) {
          obj[key].map((k: any) => {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
              if (hasError(lang, obj[key])) {
                return true
              }
            }
            return false
          })
        }
      }
    }

    return false
  }

  const handleError = (lang: string) => {
    const isNestedObjectTouched = hasError(lang, touched)
    const isNestedObjectError = hasError(lang, errors)

    if (isNestedObjectTouched && isNestedObjectError) {
      if ((lang === 'ar' && ln === 'en') || (lang === 'en' && ln === 'ar')) {
        return true
      } else {
        return false
      }
    }
    return false
  }

  return (
    <>
      <Tabs value={ln} onChange={handleChange}>
        <Tab
          value={'ar'}
          label={
            <Badge variant="dot" invisible={!handleError('ar')} color="error">
              <Box
                sx={{
                  color: handleError('ar') ? 'error.main' : '',
                  fontWeight: 'bold'
                }}
              >
                {t('arabic')}
              </Box>
            </Badge>
          }
        />
        <Tab
          value={'en'}
          label={
            <Badge variant="dot" invisible={!handleError('en')} color="error">
              <Box
                sx={{
                  color: handleError('en') ? 'error.main' : '',
                  fontWeight: 'bold'
                }}
              >
                {t('english')}
              </Box>
            </Badge>
          }
        />
      </Tabs>
    </>
  )
}

export default LanguagesTabWrapper
