import { Link } from 'react-router-dom'

// material-ui
import { ButtonBase, Box } from '@mui/material'
// project imports
import logo from 'src/assets/images/icon.png'

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  return (
    <ButtonBase component={Link} to={'/'}>
      <Box sx={{ textAlign: 'center' }}>
        <img
          src={logo}
          alt=""
          style={{ width: '200px', height: '50px', objectFit: 'contain', maxWidth: '100%' }}
        />
      </Box>
    </ButtonBase>
  )
}

export default LogoSection
