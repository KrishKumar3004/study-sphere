// DrawerComponent.js
import React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import JoinClassIcon from '@mui/icons-material/Group';
import NewClassIcon from '@mui/icons-material/Class';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const DrawerComponent = ({ open, toggleDrawer, handleJoinClass, handleCreateClass, firebase }) => (
    <Drawer variant="permanent" open={open}>
        <Toolbar>
            <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
            </IconButton>
        </Toolbar>
        <List>
            {/* List items */}
            {/* Join Class */}
            <ListItem button onClick={handleJoinClass}>
                <ListItemIcon>
                    <JoinClassIcon />
                </ListItemIcon>
                <ListItemText primary="Join Class" />
            </ListItem>
            {/* Create Class */}
            <ListItem button onClick={handleCreateClass}>
                <ListItemIcon>
                    <NewClassIcon />
                </ListItemIcon>
                <ListItemText primary="Create Class" />
            </ListItem>
            {/* Sign In/Sign Up/Sign Out */}
            {firebase.user === null ? (
                <>
                    <ListItem button onClick={(e) => navigate('/signup')}>
                        <ListItemIcon>
                            <SignUpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sign Up" />
                    </ListItem>
                    <ListItem button onClick={(e) => navigate('/signin')}>
                        <ListItemIcon>
                            <SignInIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sign In" />
                    </ListItem>
                </>
            ) : (
                <ListItem button onClick={firebase.logoutUser}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                </ListItem>
            )}
        </List>
    </Drawer>
);

export default DrawerComponent;