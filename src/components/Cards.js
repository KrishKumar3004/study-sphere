import React from 'react';
import Grid from '@mui/material/Grid';
import MediaCard from './Card';
import { useFirebase } from '../context/firebase';

const Cards = () => {
    const firebase = useFirebase();

    // Check if user is logged in and classes are available
    if (!firebase.user) {
        return <div>Please login to view classes.</div>;
    } else if (!firebase.user.classes || firebase.user.classes.length === 0) {
        return <div>No classes yet.</div>;
    }

    return (
        <Grid container spacing={3}>
            {firebase.user.classes.map((classItem) => (
                <Grid item xs={12} md={4} key={classItem.id}>
                    <MediaCard
                        title={classItem.courseId}
                        instructor={classItem.instructorName}

                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default Cards;