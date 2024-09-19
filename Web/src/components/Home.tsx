import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/system';
import picture from '../assets/test2.jpg';

// Styled components
const BackgroundContainer = styled(Box)(({ theme }) => ({
    backgroundImage: `url('../assets/mukut1.jpg')`, // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed', // Keeps the background fixed during scroll
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay for better text visibility
    },
}));

const Content = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    animation: 'fadeIn 1s ease-in',
    '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
    },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        backgroundColor: theme.palette.secondary.main,
    },
}));

const Home: React.FC = () => {
    return (
        <BackgroundContainer sx={{
          backgroundImage: `url(${picture})`, // Adjust the path as needed
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
      }}>
            <Container>
                <Content>
                    <Typography variant="h2" gutterBottom>
                        Welcome to the Night to Night Picnic!
                    </Typography>
                    <Typography variant="h5" paragraph>
                        Join us for an unforgettable experience in Mukutmanipur from <strong>December 28th, 2024</strong> to <strong>December 29th, 2024</strong>.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Our main goal is to create beautiful memories under the stars with friends, family, and nature.
                    </Typography>
                    <AnimatedButton
                        variant="contained"
                        color="secondary"
                        size="large"
                        sx={{ marginTop: 2 }}
                        onClick={() => alert('More details coming soon!')} // Replace with actual navigation
                    >
                        Learn More
                    </AnimatedButton>
                </Content>
            </Container>
        </BackgroundContainer>
    );
};

export default Home;
