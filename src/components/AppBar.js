// AppBarComponent.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

const AppBarComponent = ({ open, toggleDrawer, user }) => (
    <AppBar position="absolute" open={open}>
        <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {user !== null ? user.displayName : 'Guest'}
            </Typography>
            <IconButton color="inherit">
                <NotificationsIcon />
            </IconButton>
        </Toolbar>
    </AppBar>
);

export default AppBarComponent;