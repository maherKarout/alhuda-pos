import {
  Button,
  SxProps,
  Theme,
  CircularProgress,
  ButtonProps,
  ButtonGroup,
  Paper,
  MenuList,
  MenuItem,
  Popover,
  Popper,
  Fade,
  ClickAwayListener
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import { borderRadius } from 'src/shared/styles'
import useGetIsRtlDirection from 'src/hooks/use-get-is-rtl-direction'
interface propsType
  extends Omit<
    ButtonProps,
    keyof {
      loading: boolean
      title: string
      sx?: SxProps<Theme> | undefined
      disabled?: boolean
      variant?: 'contained' | 'outlined' | 'text'
      type?: 'button' | 'reset' | 'submit' | undefined
      onClick?: Function
    }
  > {
  loading?: boolean
  title: string | React.ReactNode
  sx?: SxProps<Theme> | undefined
  disabled?: boolean
  variant?: 'contained' | 'outlined' | 'text'
  type?: 'button' | 'reset' | 'submit' | undefined
  onClick?: Function
  enableSuccessFeedback?: boolean
}
const options = [
  { label: 'save and add new', name: 'saveAndAddNew' },
  { label: 'save and go back', name: 'saveAndGoBack' }
]
const GenericButton = ({
  loading,
  title,
  sx,
  disabled,
  variant = 'contained',
  type,
  onClick,
  enableSuccessFeedback,
  ...props
}: propsType) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const { t } = useTranslation('translation')
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'menu-button' : undefined
  const isRtl = useGetIsRtlDirection()
  const borderRadius = { large: '8' }
  return (
    <>
      <ButtonGroup disableElevation fullWidth disabled={disabled || loading} variant="contained">
        {enableSuccessFeedback && (
          <Button
            type="button"
            fullWidth={false}
            size="small"
            aria-describedby={id}
            onClick={handleClick}
            sx={{ borderRadius: `${borderRadius.large}px` }}
          >
            <ArrowDropDownIcon />
          </Button>
        )}
        <Button
          aria-label="Button group with a nested menu"
          onClick={(e) => {
            onClick && onClick(e)
          }}
          type={type}
          variant={variant}
          sx={{ p: 1.2, borderRadius: `${borderRadius.large}px`, minWidth: 'fit-content', ...sx }}
          {...props}
        >
          {!loading && (typeof title === 'string' ? t(title) : title)}
          {loading ? <CircularProgress sx={{ mx: 3 }} color="inherit" size={28} /> : null}
        </Button>
      </ButtonGroup>
      {enableSuccessFeedback && (
        <>
          <Popper
            sx={{ zIndex: 1200 }}
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            transition
            disablePortal
          >
            {({ TransitionProps }) => (
              <ClickAwayListener onClickAway={handleClose}>
                <Fade {...TransitionProps} timeout={350}>
                  <Paper sx={{ boxShadow: '1px 5px 15px grey' }}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <Button
                          onClick={handleClose}
                          type="submit"
                          name={'submitType'}
                          value={option.name}
                          variant="text"
                          sx={{ fontSize: '16px', display: 'block' }}
                          key={index}
                        >
                          {t(option.label)}
                        </Button>
                      ))}
                    </MenuList>
                  </Paper>
                </Fade>
              </ClickAwayListener>
            )}
          </Popper>
        </>
      )}
    </>
  )
}

export default GenericButton
