// About.tsx
import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import images from '../assets/image';
 // Make sure you export your images array

const About: React.FC = () => {
    return (
        <Container sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                About Mahadev ke Dewane Club
            </Typography>
            <Typography variant="body1" paragraph>
                Welcome to Mahadev ke Dewane Club, where devotion meets community spirit! Established in 2023, our club is a vibrant gathering of individuals united by our love for Lord Mahadev and a commitment to cultural celebrations that enrich our lives and strengthen our bonds.
            </Typography>

            <Typography variant="h5" gutterBottom>
                Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
                At Mahadev ke Dewane, we strive to foster a sense of togetherness through cultural events, spiritual practices, and community service. Our mission is to create a welcoming environment where members can celebrate their faith, share experiences, and enjoy each other's company.
            </Typography>

            <Typography variant="h5" gutterBottom>
                Celebrating Tradition
            </Typography>
            <Typography variant="body1" paragraph>
                One of our hallmark events is the Saraswati Pujo, where we come together to honor the Goddess of Knowledge and Wisdom. This celebration is not just a religious observance; it’s a time for our members to engage in prayers, cultural performances, and share the joy of learning and creativity.
            </Typography>

            <Typography variant="h5" gutterBottom>
                Annual Picnic Tour
            </Typography>
            <Typography variant="body1" paragraph>
                Every year, we organize an exciting Picnic Tour for our members and their families. This fun-filled day allows us to unwind, connect with nature, and enjoy quality time together. From games to delicious food, our picnic is a highlight of the year that everyone looks forward to.
            </Typography>

            <Typography variant="h5" gutterBottom>
                Join Us
            </Typography>
            <Typography variant="body1" paragraph>
                Whether you're a lifelong devotee of Lord Mahadev or someone curious about our traditions, Mahadev ke Dewane Club welcomes you with open arms. Join us in our celebrations, participate in our activities, and be part of a community that values faith, friendship, and fun.
            </Typography>

            <Typography variant="h5" gutterBottom>
                Get Involved
            </Typography>
            <Typography variant="body1" paragraph>
                We invite you to participate in our upcoming events, volunteer your time, or simply share in the joy of our gatherings. Together, let’s keep the spirit of Mahadev alive and thriving in our community!
            </Typography>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Our Moments
                </Typography>
                <Carousel showArrows={true} infiniteLoop={true} autoPlay={true} interval={3000}>
                    {images.map((image:any, index:any) => (
                        <div key={index}>
                            <img src={image} alt={`Event ${index + 1}`} style={{ width: '100%', borderRadius: '10px' }} />
                        </div>
                    ))}
                </Carousel>
            </Box>
        </Container>
    );
};

export default About;
