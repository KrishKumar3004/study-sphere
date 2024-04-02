import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Card, CardContent } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import { useNavigate } from 'react-router-dom';

const BlogForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attachedFile, setAttachedFile] = useState(null); // Use null to represent no file initially

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



        await firebase.addBlog(classId, title, description, attachedFile);
        setTitle('');
        setDescription('');
        setAttachedFile(null); // Reset attachedFile after submission
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAttachedFile(file);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Create Blog
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Typography variant="h5" gutterBottom>
                Existing Blogs
            </Typography>
            <Grid container spacing={2}>
                {blogs.map((blog) => {
                    console.log(blog);
                    return (
                        <Grid item key={blog.id} xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{blog.title}</Typography>
                                    <Typography>{blog.description}</Typography>
                                    {/* Display other blog details as needed */}
                                    <Button onClick={() => handleDownload(blog.attachedFileURL)}> Download</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    );
};

export default BlogForm;