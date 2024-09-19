import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Avatar, useTheme, Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { IUser } from '../common/user';
import { clearUser } from '../redux/userSlice';
import picture from '../assets/baba.jpg';

// Styled components for custom styling
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
}));

const LogoContainer = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  backgroundColor:theme.palette.background.paper, // Space between logo and buttons
  cursor: 'pointer',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.1)', // Hover animation
  },
  [theme.breakpoints.down('sm')]: {
    marginRight: theme.spacing(1), // Adjust margin on smaller screens
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
  const userData = useSelector((state: RootState) => state.user.userData) as IUser | null;
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onHandleregister = () => {
    navigate("/register");
  };

  const onHandleContact = () => {
    navigate("/contact");
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const onHandleLogout = () => {
    dispatch(clearUser());
    navigate("/user-details");
  }

  const menuItems = [
    { text: 'Home', onClick: () => navigate('/') },
    { text: 'About', onClick: () => navigate('/about') },
    { text: 'Contact', onClick: onHandleContact },
    ...(userData ? 
      [{ text: 'Logout', onClick: onHandleLogout }] : 
      [{ text: 'Login', onClick: () => navigate('/login') }]
  )
  ];

  return (
    <>
      <StyledAppBar position="sticky">
        <Toolbar>
          <LogoContainer onClick={() => navigate('/')}>
            <Avatar alt="User Avatar" src={picture} />
          </LogoContainer>
          <Box sx={{ flexGrow: 1 }} />
          
          <NavButton color="primary">Home</NavButton>
          <NavButton color="primary">About</NavButton>
          <NavButton color="primary" onClick={onHandleContact}>Contact</NavButton>
          {userData ? 
            <NavButton color="primary" onClick={onHandleLogout}>Logout</NavButton> :
            <NavButton color="primary" onClick={onHandleregister}>Login</NavButton>
          }
          <MenuContainer>
            <IconButton edge="end" color="primary" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </MenuContainer>
        </Toolbar>
      </StyledAppBar>

      {/* Drawer for Mobile Menu */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} onClick={() => { item.onClick(); toggleDrawer(false)(); }} component="div">
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
