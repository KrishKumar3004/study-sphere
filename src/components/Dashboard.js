import * as React from 'react';
import { useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import JoinIcon from '@mui/icons-material/Group';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SignInIcon from '@mui/icons-material/ExitToApp';
import SignUpIcon from '@mui/icons-material/PersonAdd';
import NewClassIcon from '@mui/icons-material/Class';
import JoinClassIcon from '@mui/icons-material/Group';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useFirebase } from '../context/firebase';
import BasicModal from './CreateClass';
import Join from './JoinClass';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef } from 'react';
import JoinClass from './JoinClass';
import CreateClass from './CreateClass';
import Cards from './Cards';
import Class from './Class';
const drawerWidth = 240;


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);


const defaultTheme = createTheme();

export default function Dashboard() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const navigate = useNavigate();
    const firebase = useFirebase();

    const [displayName, setDisplayName] = React.useState("Guest");
    const [joinModalOpen, setJoinModalOpen] = React.useState(false);
    const [createModalOpen, setCreateModalOpen] = React.useState(false);

    useEffect(() => {
        if (firebase.user !== null) {
            setDisplayName(firebase.user.displayName);
        } else {
            setDisplayName("Guest");
        }
    }, [firebase.user]);

    const handleJoinClass = () => {
        console.log("hello");
        setJoinModalOpen(true);
    }
    const handleCreateClass = () => {
        setCreateModalOpen(true);
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px',
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >

                            {displayName}
                        </Typography>
                        <IconButton color="inherit" onClick={(e) => navigate('/')}>
                            <Badge color="secondary">
                                <i class="fa-solid fa-user-graduate"></i>
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List>

                        <ListItem button onClick={(e) => navigate('/')}>
                            <ListItemIcon>
                                <JoinClassIcon />
                            </ListItemIcon>
                            <ListItemText primary="All classes" />
                        </ListItem>


                        <ListItem button >
                            <ListItemIcon onClick={handleJoinClass}>
                                <JoinClassIcon />
                            </ListItemIcon>
                            <ListItemText onClick={handleJoinClass} primary="Join Class" />
                            <JoinClass open={joinModalOpen} setOpen={setJoinModalOpen} />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon onClick={handleCreateClass}>
                                <NewClassIcon />
                            </ListItemIcon>
                            <ListItemText onClick={handleCreateClass} primary="Create Class" />
                            <CreateClass open={createModalOpen} setOpen={setCreateModalOpen} />
                        </ListItem>

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
                            <ListItem button onClick={firebase.signOutUser}>
                                <ListItemIcon>
                                    <ExitToAppIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sign Out" />
                            </ListItem>
                        )}

                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />

                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

                        <Routes>
                            <Route
                                exact path="/"
                                element={
                                    <Cards />
                                }
                            />
                            <Route
                                exact path="/signup"
                                element={
                                    <SignUp />
                                }
                            />
                            <Route
                                exact path="/signin"
                                element={
                                    <SignIn />
                                }
                            />
                            <Route
                                exact path="/:classId"
                                element={
                                    <Class />
                                }
                            />

                        </Routes>


                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}