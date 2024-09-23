// About.tsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import images from '../assets/image'; // Make sure this imports your images correctly

const About: React.FC = () => {
    return (
        <Container sx={{ padding: 4, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                    color: '#4a148c',
                    fontWeight: 'bold',
                    animation: 'fadeIn 2s',
                }}
            >
                About Mahadev ke Dewane Club
            </Typography>

            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'justify',
                    lineHeight: '1.6',
                    animation: 'slideIn 1.5s',
                    color: '#333',
                }}
            >
                Welcome to Mahadev ke Dewane Club, where devotion meets community spirit! Established in 2023, our club is a vibrant gathering of individuals united by our love for Lord Mahadev and a commitment to cultural celebrations that enrich our lives and strengthen our bonds.
            </Typography>

            <Box sx={{ mt: 4 }}>
                <Typography
                    variant="h5"
                    align="center"
                    gutterBottom
                    sx={{
                        color: '#4a148c',
                        fontWeight: 'bold',
                        animation: 'fadeIn 2s',
                    }}
                >
                    Our Moments
                </Typography>
                <Carousel showArrows={true} infiniteLoop={true} autoPlay={true} interval={3000}>
                    {images.map((image: any, index: any) => (
                        <div key={index}>
                            <img
                                src={image}
                                alt={`Event ${index + 1}`}
                                style={{
                                    width: '100%',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                                    transition: 'transform 0.5s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            />
                        </div>
                    ))}
                </Carousel>
            </Box>

            <Typography variant="h5" gutterBottom sx={{ color: '#4a148c', fontWeight: 'bold', animation: 'fadeIn 2s' }}>
                Our Mission
            </Typography>
            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'justify',
                    lineHeight: '1.6',
                    animation: 'slideIn 1.5s',
                    color: '#333',
                }}
            >
                At Mahadev ke Dewane, we strive to foster a sense of togetherness through cultural events, spiritual practices, and community service. Our mission is to create a welcoming environment where members can celebrate their faith, share experiences, and enjoy each other's company.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ color: '#4a148c', fontWeight: 'bold', animation: 'fadeIn 2s' }}>
                Celebrating Tradition
            </Typography>
            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'justify',
                    lineHeight: '1.6',
                    animation: 'slideIn 1.5s',
                    color: '#333',
                }}
            >
                One of our hallmark events is the Saraswati Pujo, where we come together to honor the Goddess of Knowledge and Wisdom. This celebration is not just a religious observance; it’s a time for our members to engage in prayers, cultural performances, and share the joy of learning and creativity.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ color: '#4a148c', fontWeight: 'bold', animation: 'fadeIn 2s' }}>
                Annual Picnic Tour
            </Typography>
            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'justify',
                    lineHeight: '1.6',
                    animation: 'slideIn 1.5s',
                    color: '#333',
                }}
            >
                Every year, we organize an exciting Picnic Tour for our members and their families. This fun-filled day allows us to unwind, connect with nature, and enjoy quality time together. From games to delicious food, our picnic is a highlight of the year that everyone looks forward to.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ color: '#4a148c', fontWeight: 'bold', animation: 'fadeIn 2s' }}>
                Join Us
            </Typography>
            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'justify',
                    lineHeight: '1.6',
                    animation: 'slideIn 1.5s',
                    color: '#333',
                }}
            >
                Whether you're a lifelong devotee of Lord Mahadev or someone curious about our traditions, Mahadev ke Dewane Club welcomes you with open arms. Join us in our celebrations, participate in our activities, and be part of a community that values faith, friendship, and fun.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ color: '#4a148c', fontWeight: 'bold', animation: 'fadeIn 2s' }}>
                Get Involved
            </Typography>
            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'justify',
                    lineHeight: '1.6',
                    animation: 'slideIn 1.5s',
                    color: '#333',
                }}
            >
                We invite you to participate in our upcoming events, volunteer your time, or simply share in the joy of our gatherings. Together, let’s keep the spirit of Mahadev alive and thriving in our community!
            </Typography>
        </Container>
    );
};

export default About;
