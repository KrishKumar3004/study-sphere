import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useMediaQuery } from '@mui/material';
import { useFirebase } from '../context/firebase';
import { useNavigate } from 'react-router-dom';

const JoinClass = ({ open, setOpen }) => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const modalWidth = isSmallScreen ? '90%' : 600;
    const firebase = useFirebase();
    const [courseId, setCourseId] = React.useState("");
    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        firebase.joinClass(courseId);
        setOpen(false);
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: modalWidth,
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 8,
                }}
            >
                {firebase.user ? (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Join Your Class
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Welcome to the class joining wizard. Please enter the unique Course ID for your class.
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                id="courseId"
                                value={courseId}
                                onChange={(event) => setCourseId(event.target.value)}
                                placeholder='Enter Course ID'
                                style={{ marginBottom: '16px', width: '100%', padding: '8px' }}
                            />
                            <Button variant="contained" color="primary" type="submit">
                                Join Class
                            </Button>
                        </form>
                    </>
                ) : (
                    <Typography variant="body1" gutterBottom>
                        Please login to join the class.
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

export default JoinClass;