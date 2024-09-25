import React from 'react';
import { Dialog, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import s1 from '../assets/s1.jpg';
import s2 from '../assets/s2.jpg';
import s3 from '../assets/s3.jpg';
import s4 from '../assets/s4.jpg';
import s5 from '../assets/s5.jpg';
import s6 from '../assets/s6.jpg';
import s7 from '../assets/s7.jpg';

// Styled components
const ImageSection = styled(Box)<any>(({ img }) => ({
    backgroundImage: `url(${img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '200px',
    marginBottom: '16px',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.5s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const ImageSectionComponent: React.FC<any> = ({ img }) => (
    <ImageSection img={img} />
);

const PopupTitle = styled(Box)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    animation: 'fadeIn 0.3s ease-in-out',
    '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
    },
}));

const PopupContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    overflowY: 'auto',
    maxHeight: '70vh',
    '@media (max-width: 600px)': {
        padding: theme.spacing(1),
    },
}));

const DialogContainer = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '16px',
        animation: 'scaleIn 0.3s ease-in-out',
        '@keyframes scaleIn': {
            '0%': { transform: 'scale(0.5)' },
            '100%': { transform: 'scale(1)' },
        },
    },
}));

const ResponsivePopup: React.FC<any> = ({ open, handleClose }) => {
    return (
        <DialogContainer open={open} onClose={handleClose} fullWidth maxWidth="md">
            <PopupTitle>
                Mukutmanipur Local Sightseeing
                <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
                    <CloseIcon />
                </IconButton>
            </PopupTitle>
            <PopupContent>
                <ImageSectionComponent img={s1} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Kangsabati Dam
                </Typography>
                <Typography paragraph>
                    Kangsabati dam was built along 11 km to grant irrigation facilities...
                </Typography>

                <ImageSectionComponent img={s2} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Pareshnath Shiv Mandir
                </Typography>
                <Typography paragraph>
                    Pareshnath Shiv Mandir is an open temple of Mahadev...
                </Typography>

                <ImageSectionComponent img={s3} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Musafirana Viewpoint
                </Typography>
                <Typography paragraph>
                    Vast stretch of water at one side, lush green valley on the other...
                </Typography>

                <ImageSectionComponent img={s4} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Bonpukuria Deer Park
                </Typography>
                <Typography paragraph>
                    Bonpukuria Deer Park is a perfect place for family outing...
                </Typography>

                <Typography variant="h6" sx={{ margin: '20px 0', fontWeight: 'bold' }}>
                    Other Places of Interest (Within 30KM of Mukutmanipur)
                </Typography>

                <ImageSectionComponent img={s5} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Wonderful Sunrise & Sunset Points
                </Typography>
                <Typography paragraph>
                    The view of Mukutmanipur in the evening when it's close to sunset...
                </Typography>

                <ImageSectionComponent img={s6} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Ambikanagar Temple
                </Typography>
                <Typography paragraph>
                    Ambikanagar Temple, situated in Ambikanagar village...
                </Typography>

                <ImageSectionComponent img={s7} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    Jhilimili 12 Mile Forest
                </Typography>
                <Typography paragraph>
                    Approx. 30km from Mukutmanipur Jhilimili forest...
                </Typography>
            </PopupContent>
        </DialogContainer>
    );
};

export default ResponsivePopup;
