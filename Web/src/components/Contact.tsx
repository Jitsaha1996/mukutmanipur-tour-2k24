import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  styled,
} from '@mui/material';
import { contactDetails } from '../common/contact';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[10],
  },
  background: theme.palette.primary.light,
  borderRadius: '10px',
  overflow: 'hidden',
}));

const StyledCardMedia = styled('div')(({ theme }) => ({
  height: 200,
  width: '100%',
  transition: 'transform 0.3s',
  overflow: 'hidden',
  '&:hover img': {
    transform: 'scale(1.1)', // Scale up the image on hover
  },
}));

const Contact: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Contact Details
      </Typography>
      <Grid container spacing={2}>
        {contactDetails.map((contact, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard>
              <StyledCardMedia>
                <CardMedia
                  component="img"
                  alt={contact.name}
                  image={contact.image} // Use the imported image directly
                  sx={{width: '100%', objectFit: 'cover' }} // Ensure it fills the div
                />
              </StyledCardMedia>
              <CardContent>
                <Typography variant="h5" component="div">
                  {contact.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {contact.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {contact.phone}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Contact;
