import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid, Card, CardContent, Avatar, Divider, Link } from '@mui/material';
import { IUser } from '../common/user';
import { RootState } from '../redux/store';
import { getFromLocalStorage } from '../redux/localStorage';
import { setUser } from '../redux/userSlice';
import { Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserDetails: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state: RootState) => state.user.userData) as IUser | null;

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUserData: IUser | null = getFromLocalStorage('userData');

            if (storedUserData) {
                try {
                    const response = await fetch(`https://mukutmanipur-tour-2k24.onrender.com/api/users/email/${storedUserData.email}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) throw new Error('Failed to fetch user data');

                    const userData = await response.json();
                    if (userData)
                        dispatch(setUser(userData)); // Dispatch the user data if the fetch is successful
                } catch (error) {
                    console.error("Error fetching user data:", error); // Log the error for debugging
                }
            }
        };

        fetchUserData(); // Call the async function
    }, [dispatch]);


    if (!userData) {
        return (
            <Box sx={{ padding: 4, textAlign: 'center' }}>
                <Typography variant="h5">
                    No user data available.{' '}
                    <Link
                        onClick={() => navigate('/login')}
                        sx={{
                            cursor: 'pointer',
                            color: 'primary.main',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: 'secondary.main',
                                textDecoration: 'none',
                            },
                        }}
                    >
                        Please log in.
                    </Link>
                </Typography>
            </Box>
        );
    }

    return (
        <Fade in={true}>
            <Box
                sx={{
                    padding: 4,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: 800,
                    margin: 'auto',
                    overflow: 'hidden',
                }}
            >
                <Typography variant="h4" gutterBottom textAlign="center">
                    User Details
                </Typography>
                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Avatar
                                alt={userData.rName}
                                src={userData.pic} // Assuming userData has a picture URL
                                sx={{ width: 100, height: 100, marginRight: 2 }}
                            />
                            <Box>
                                <Typography variant="h5">{userData.rName}</Typography>
                                <Typography variant="subtitle1">{userData.email}</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Personal Information</Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography><strong>Date of Birth:</strong> {userData.dob}</Typography>
                            <Typography><strong>Phone Number:</strong> {userData.phone}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Booking Confirmation Status Section */}
                <Box sx={{ marginBottom: 2, padding: 2, borderRadius: 1, backgroundColor: userData.isConfirmSeatBooking ? '#e8f5e9' : '#fff3e0' }}>
                    <Typography variant="h6" textAlign="center" color={userData.isConfirmSeatBooking ? 'green' : 'orange'}>
                        {userData.isConfirmSeatBooking ? 'Approved' : 'On Hold'}
                    </Typography>
                    <Typography textAlign="center">
                        {userData.isConfirmSeatBooking
                            ? 'Welcome to Mahadev ke Dewane tour of 2k24 Mukutmanipur trip with itineraries of these days.'
                            : 'Thank you for your request! Our team is currently reviewing it and will take action shortly. In the meantime, we appreciate your patience and encourage you to stay tuned for updates!'}
                    </Typography>
                </Box>

                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6">Family Members</Typography>
                        <Grid container spacing={2}>
                            {userData?.familyMembers?.map((member, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Fade in={true}>
                                        <Card elevation={1} sx={{ padding: 2, textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
                                            <Typography><strong>Name:</strong> {member.name}</Typography>
                                            <Typography><strong>Seat Preference:</strong> {member.seatPreference}</Typography>
                                            {userData.isConfirmSeatBooking && member?.seatNumber === "" ?
                                                <Typography><strong>Seat Number:</strong> yet to be assigned </Typography>
                                                : null}
                                        </Card>
                                    </Fade>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Fade>
    );
};

export default UserDetails;
