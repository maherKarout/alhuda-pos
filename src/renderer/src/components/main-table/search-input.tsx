import { TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
type propsType = {
  openSearch: boolean
  search: (key: string) => void
  setOpenSearch: Function
}
function SearchInput({ openSearch, search, setOpenSearch }: propsType) {
  const { t } = useTranslation('translation')
  const inputRef = useRef<any>(null)
  const [searchValue] = useSearchParams()
  const searchParam = searchValue.get('searchValue') ?? ''
  const [value, setValue] = useState(searchParam)

  useEffect(() => {
    if (value !== searchParam) {
      setValue(searchParam)
    }
  }, [searchParam])

  useEffect(() => {
    if (value === '') search('')
    const timeout = setTimeout(() => {
      value !== '' ? search(value) : null
    }, 700)
    return () => {
      clearTimeout(timeout)
    }
  }, [value])

  useEffect(() => {
    if (openSearch) {
      inputRef.current?.focus()
    } else {
      inputRef.current?.blur()
    }
  }, [openSearch])

  return (
    <TextField
      inputRef={inputRef}
      value={value}
      onBlur={() => {
        value === '' ? setOpenSearch(false) : undefined
      }}
      onChange={(e) => setValue(e.target.value)}
      label={t('search')}
      variant="outlined"
      size="small"
      sx={{
        width: !openSearch ? '0px' : '250px',
        opacity: !openSearch ? '0' : '1',
        transition: 'all 0.4s',
        overFlow: 'hidden'
      }}
    />
  )
}

export default SearchInput
