import React, { useState } from 'react'
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { ButtonFirst } from '../../utils/global-variables.js';


export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form data here (e.g., send it to a server or display a success message)
        console.log(formData);
        // Reset form fields
        setFormData({
            name: "",
            email: "",
            message: "",
        });
    };

    return (
        <Container maxWidth="md" className='mt-4'>
            <Typography variant="h4" align="center" gutterBottom>
                Contact Us
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                        Address
                    </Typography>
                    <Typography gutterBottom>Breslauer Str. 201/Haus A, C</Typography>
                    <Typography gutterBottom>90471 Nürnberg</Typography>
                    <Typography gutterBottom>Germany</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                        Contact Form
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="name"
                            label="Name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />

                        <TextField
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            type="email"
                        />

                        <TextField
                            name="message"
                            label="Message"
                            value={formData.message}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            multiline
                            rows={4}
                        />

                        <Button
                            variant="contained"
                            style={{ backgroundColor: ButtonFirst }}
                            type="submit"
                            fullWidth
                        >
                            Submit
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
}
