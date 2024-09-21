import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Divider,
    Link,
    IconButton,
    Button,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Fade,
    Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; 
import AnnouncementIcon from '@mui/icons-material/Announcement'; 
import { IUser } from '../common/user';
import { RootState } from '../redux/store';
import { getFromLocalStorage } from '../redux/localStorage';
import { setUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; 
import { motion } from 'framer-motion';
import announcementMusic from '../assets/checkai.mp3'

const seatPreferences = [
    'Window Seat',
    'Middle',
    'Front',
    'Back',
    'No Preference'
];

const UserDetails: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state: RootState) => state.user.userData) as IUser | null;

    const [isEditing, setIsEditing] = useState(false);
    const [numFamilyMembers, setNumFamilyMembers] = useState(0);
    const [familyMembers, setFamilyMembers] = useState(userData?.familyMembers || []);
    const [loading, setLoading] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Play the audio
        if (audioRef.current) {
            audioRef.current.play();
        }

        // Stop the audio after 10 seconds (for example)
        const timer = setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0; // Optionally reset to the start
            }
        }, 10000); // Time in milliseconds (10 seconds)

        return () => {
            clearTimeout(timer); // Clear the timer on component unmount
            if (audioRef.current) {
                audioRef.current.pause(); // Ensure audio is paused
            }
        };
    }, []);


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
                    if (userData) {
                        dispatch(setUser(userData));
                        setFamilyMembers(userData.familyMembers);
                        setNumFamilyMembers(userData.familyMembers.length);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/announcement/');
                if (!response.ok) throw new Error('Failed to fetch announcements');
                const data = await response.json();
                setAnnouncements(data);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };

        fetchUserData();
        fetchAnnouncements();
    }, [dispatch]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleFamilyMemberChange = (index: number, field: string, value: any) => {
        const updatedMembers = [...familyMembers];
        updatedMembers[index] = { ...updatedMembers[index], [field]: value };
        setFamilyMembers(updatedMembers);
    };

    const handleNumFamilyMembersChange = (e: any) => {
        const value = e.target.value as number;
        setNumFamilyMembers(value);
        const updatedMembers = Array.from({ length: value }, (_, i) => familyMembers[i] || { name: '', seatPreference: '', seatNumber: '' });
        setFamilyMembers(updatedMembers);
    };

    const handleUpdate = async () => {
        setLoading(true);

        try {
            const payload = {
                ...userData,
                familyMembers: familyMembers,
                isConfirmSeatBooking: false,
            };
            const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/users/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to update family members');
            const updatedUserData = await response.json();
            dispatch(setUser(updatedUserData));
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.save("user_details.pdf");
    };

    const handleAnnouncementClick = () => {
        setOpenSnackbar(true);
    };

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

    const hasSeatNumbers = familyMembers.some(member => member.seatNumber);
    const shouldShowAnnouncements = userData.isConfirmSeatBooking && hasSeatNumbers;

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
                <audio  ref={audioRef} src={announcementMusic} autoPlay loop style={{ display: 'none' }} /> Background music
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        User Details
                    </Typography>
                    <IconButton onClick={handleDownloadPDF}>
                        <PictureAsPdfIcon color="primary" />
                    </IconButton>
                </Box>

                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h5">{userData.rName}</Typography>
                            <Typography variant="subtitle1">{userData.email}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Personal Information</Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography><strong>Date of Birth:</strong> {userData.dob}</Typography>
                            <Typography><strong>Phone Number:</strong> {userData.phone}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                {shouldShowAnnouncements && (
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="h5" color="primary" textAlign="center">
                            Latest Announcements
                        </Typography>
                        <Grid container spacing={2}>
                            {announcements.map((announcement, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, translateY: 20 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Card variant="outlined" sx={{ padding: 2, textAlign: 'center' }}>
                                            <Typography variant="h6">{announcement.announcementId}</Typography>
                                            <Typography variant="body2">{announcement.announcementDetails}</Typography>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                        <IconButton onClick={handleAnnouncementClick}>
                            <AnnouncementIcon color="secondary" fontSize="large" />
                        </IconButton>
                    </Box>
                )}

                <Card variant="outlined">
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Family Members</Typography>
                            <IconButton onClick={handleEditToggle}>
                                <EditIcon />
                            </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                            {!userData?.isArchived && isEditing ? (
                                <>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <Select
                                                value={numFamilyMembers}
                                                onChange={handleNumFamilyMembersChange}
                                            >
                                                {Array.from({ length: 10 }, (_, i) => (
                                                    <MenuItem key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {familyMembers.slice(0, numFamilyMembers).map((member, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Card elevation={1} sx={{ padding: 2, textAlign: 'center' }}>
                                                <TextField
                                                    label="Name"
                                                    value={member.name}
                                                    onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                                                    fullWidth
                                                />
                                                <FormControl fullWidth>
                                                    <Select
                                                        label="Seat Preference"
                                                        value={member.seatPreference}
                                                        onChange={(e) => handleFamilyMemberChange(index, 'seatPreference', e.target.value)}
                                                    >
                                                        {seatPreferences.map((preference) => (
                                                            <MenuItem key={preference} value={preference}>
                                                                {preference}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Card>
                                        </Grid>
                                    ))}
                                    <Button
                                        onClick={handleUpdate}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update'}
                                    </Button>
                                </>
                            ) : (
                                familyMembers.map((member, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Fade in={true}>
                                            <Card elevation={1} sx={{ padding: 2, textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
                                                <Typography><strong>Name:</strong> {member.name}</Typography>
                                                <Typography><strong>Seat Preference:</strong> {member.seatPreference}</Typography>
                                                {userData?.isConfirmSeatBooking && member?.seatNumber ? (
                                                    <Typography><strong>Seat Number:</strong> {member.seatNumber}</Typography>
                                                ) : (
                                                    <Typography><strong>Seat Number:</strong> Yet to Assign</Typography>
                                                )}
                                            </Card>
                                        </Fade>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                <Snackbar
                    open={openSnackbar}
                    onClose={() => setOpenSnackbar(false)}
                    message="Announcement made!"
                    autoHideDuration={3000}
                />
            </Box>
        </Fade>
    );
};

export default UserDetails;
