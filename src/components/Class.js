import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Card, CardContent } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import { useNavigate } from 'react-router-dom';

const BlogForm = () => {

    const [description, setDescription] = useState('');
    const [attachedFile, setAttachedFile] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const { classId } = useParams();
    const firebase = useFirebase();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBlogs() {
            const fetchedBlogs = await firebase.getBlogs(classId);
            setBlogs(fetchedBlogs);
        }
        fetchBlogs();
    }, [classId]);

    const handleDownload = async (attachedFileUrl) => {
        console.log("HANDLE DOWNLOLAD", attachedFileUrl)
        try {
            const filePath = attachedFileUrl;
            const downloadUrl = await firebase.generateDownloadUrl(filePath);
            console.log('Download URL:', downloadUrl);

            // Create an anchor element with download attribute
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = filePath.substring(filePath.lastIndexOf('/') + 1);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (error) {
            console.error('Error generating download URL:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(attachedFile);
        await firebase.addBlog(classId, description, attachedFile);
        setDescription('');
        setAttachedFile(null); // Reset attachedFile after submission
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAttachedFile(file);
    };

    return (

        <div>
            <Card sx={{ width: '95%', margin: 'auto', padding: '1rem' }}>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <TextField
                                    label="Announce something to your class"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    id="fileInput"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit">
                                    Create Blog
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            {blogs.length > 0 && (
                <Card sx={{ width: '95%', margin: 'auto', marginTop: '2rem', padding: '1rem' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            {blogs.map((blog) => {
                                console.log(blog);
                                return (
                                    <Grid item key={blog.id} xs={12}>
                                        <Card sx={{ width: '100%', marginBottom: '1rem' }}>
                                            <CardContent>
                                                <Typography>{blog.description}</Typography>
                                                <Button onClick={() => handleDownload(blog.attachedFileURL)}>Download the Attached File</Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </CardContent>
                </Card>
            )}

        </div>
    );
};

export default BlogForm;



