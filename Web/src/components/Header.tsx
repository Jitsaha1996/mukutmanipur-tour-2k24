import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, useMediaQuery, useTheme, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';

// Styled components for custom styling
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
}));

const Logo = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  fontWeight: 700,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const MenuContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate(); 
  const onHandleregister =()=>{
    navigate("/register");
  }
  const onHandleContact =()=>{
    navigate("/contact");
  }
  

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        {/* Logo Section */}
        <Logo variant="h6">
          MyApp
        </Logo>

        {/* Navigation Buttons */}
        <Box sx={{ flexGrow: 1 }} />

        <NavButton color="primary">Home</NavButton>
        <NavButton color="primary">About</NavButton>
        <NavButton color="primary" onClick={onHandleContact}>Contact</NavButton>
        <NavButton color="primary" onClick={onHandleregister}>Register</NavButton>

        {/* Menu Icon for Mobile */}
        <MenuContainer>
          <IconButton edge="end" color="primary" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </MenuContainer>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
