// src/UserDetails.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid, Card, CardContent, Avatar, Divider } from '@mui/material';
import { IUser } from '../common/user';
import { RootState } from '../redux/store';
import { getFromLocalStorage } from '../redux/localStorage';
import { setUser } from '../redux/userSlice';
import { Fade } from '@mui/material';

const UserDetails: React.FC = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state: RootState) => state.user.userData) as IUser | null;

    useEffect(() => {
        const storedUserData = getFromLocalStorage('userData');
        if (storedUserData) {
            dispatch(setUser(storedUserData)); // Load user data from local storage into Redux
        }
    }, [dispatch]);

    if (!userData) {
        return (
            <Box sx={{ padding: 4, textAlign: 'center' }}>
                <Typography variant="h5">No user data available. Please log in.</Typography>
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

                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6">Family Members</Typography>
                        <Grid container spacing={2}>
                            {userData.familyMembers.map((member, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Fade in={true}>
                                        <Card elevation={1} sx={{ padding: 2, textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
                                            <Typography><strong>Name:</strong> {member.name}</Typography>
                                            <Typography><strong>Seat Preference:</strong> {member.seatPreference}</Typography>
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
