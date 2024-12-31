import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
  } from '@mui/material'
  import { Link as RouterLink, useNavigate } from 'react-router-dom'
  import { useAuth } from '../context/AuthContext'
  import { useState } from 'react'
  
  const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
  
    const handleClose = () => {
      setAnchorEl(null)
    }
  
    const handleLogout = () => {
      logout()
      handleClose()
      navigate('/')
    }
  
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Coursera Platform
          </Typography>
  
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                {user.role === 'instructor' && (
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/instructor/dashboard"
                  >
                    Instructor Dashboard
                  </Button>
                )}
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {user.name[0].toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      navigate('/profile')
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      navigate('/purchased-courses')
                    }}
                  >
                    My Courses
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    )
  }
  
  export default Navbar
  