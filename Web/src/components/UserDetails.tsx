import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../assets/baba.jpg';
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
    Backdrop,
    CircularProgress,
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
    'Window',
    'Middle',
    'Perimeter',
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
    const hasSeatNumbers = familyMembers.some(member => member.seatNumber);
    const shouldShowAnnouncements = userData?.isConfirmSeatBooking && hasSeatNumbers;

    useEffect(() => {
        // Play the audio

        const audioElement = audioRef.current;

        if (audioElement) {
            // Set up a listener for when the audio is ready to play
            const handleCanPlayThrough = () => {
                audioElement.play();
            };

            audioElement.addEventListener('canplaythrough', handleCanPlayThrough);

            // Stop the audio after 10 seconds (for example)
            const timer = setTimeout(() => {
                if (audioElement) {
                    audioElement.pause();
                    audioElement.currentTime = 0; // Optionally reset to the start
                }
            }, 10000); // Time in milliseconds (10 seconds)

            return () => {
                clearTimeout(timer); // Clear the timer on component unmount
                audioElement.removeEventListener('canplaythrough', handleCanPlayThrough);
                if (audioElement) {
                    audioElement.pause(); // Ensure audio is paused
                }
            };
        }


    }, []);


    useEffect(() => {
        const fetchUserData = async () => {
            const storedUserData: IUser | null = getFromLocalStorage('userData');

            if (storedUserData) {
                try {
                    setLoading(true);
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/email/${storedUserData.email}`, {
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
                finally{
                    setLoading(false);
                }
            }
        };


        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/announcement/`);
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to update family members');
            const updatedUserData = await response.json();
            if (updatedUserData?.email) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/email/${updatedUserData?.email}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) throw new Error('Failed to fetch user data');
                    const userDataresponse = await response.json();
                    if (userDataresponse) {
                        dispatch(setUser(userDataresponse));
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
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
    
        // Add Logo to the Header
        const imgData = logo; // Use the base64 string or image URL
        doc.addImage(imgData, 'JPEG', 70, 10, 50, 50); // Adjust x, y, width, height as needed
    
        // Title
        doc.setFontSize(24);
        doc.setTextColor(40, 40, 200); // Blue color
        doc.text("Mahadev ka Dewane Trip to Mukutmanipur 2k24", 10, 70);
    
        // User Details
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0); // Black color
        doc.text(`User Details`, 10, 90);
        doc.setFontSize(14);
        doc.text(`Name: ${userData?.rName}`, 10, 110);
        doc.text(`Email: ${userData?.email}`, 10, 120);
        doc.text(`Date of Birth: ${userData?.dob}`, 10, 130);
        doc.text(`Phone Number: ${userData?.phone}`, 10, 140);
    
        // Family Members Section
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 100); // Dark blue color
        doc.text("Family Members:", 10, 160);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black color
    
        let currentYPosition = 170; // Start position for family members
        const pageHeight = doc.internal.pageSize.height; // Height of the page
        const margin = 10; // Margin from the bottom of the page
    
        familyMembers.forEach((member, index) => {
            // Check if we need to create a new page
            if (currentYPosition + 40 > pageHeight - margin) {
                doc.addPage(); // Add a new page
                currentYPosition = 10; // Reset Y position for the new page
            }
    
            doc.setTextColor(0, 100, 0); // Dark green for member name
            doc.text(`- Name: ${member.name}`, 10, currentYPosition);
            
            doc.setTextColor(200, 0, 0); // Red for seat preference
            doc.text(`  Seat Preference: ${member.seatPreference}`, 10, currentYPosition + 10);
            
            doc.setTextColor(0, 0, 200); // Blue for seat number
            doc.text(`  Seat Number: ${member.seatNumber || 'Not Assigned'}`, 10, currentYPosition + 20);
    
            // Draw a colored line after each member for better separation
            doc.setDrawColor(255, 165, 0); // Orange color for lines
            doc.line(10, currentYPosition + 25, 200, currentYPosition + 25); // Draw line
    
            currentYPosition += 40; // Increase position for next member
        });
    
        // Add Boarding Pass Header
        if (currentYPosition + 30 > pageHeight - margin) {
            doc.addPage(); // Add a new page if needed
            currentYPosition = 10; // Reset Y position for the new page
        }
        
        doc.setFontSize(18);
        doc.setTextColor(255, 0, 0); // Red for boarding pass
        doc.text("Mahadev Ke Dewane Boarding Pass", 10, currentYPosition);
    
        // Save the document
        doc.save(`user_details_${userData?.rName}.pdf`);
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
                {/* <audio ref={audioRef} src={announcementMusic} autoPlay  style={{ display: 'none' }} /> */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        User Details
                    </Typography>
                    {/* PDF Icon */}
                    {userData.isConfirmSeatBooking && !userData.isArchived && familyMembers.length > 0 && familyMembers.some(member => member.seatNumber) && (
                        <IconButton onClick={handleDownloadPDF}>
                            <PictureAsPdfIcon color="primary" />
                        </IconButton>
                    )}
                </Box>

                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <Typography variant="h5">{userData.rName}</Typography>
                            <Typography variant="subtitle1">{userData.email}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Avatar
                                alt={userData.rName}
                                src={userData.pic}
                                sx={{ width: 100, height: 100, marginRight: 2 }}
                            />
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Personal Information</Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography><strong>Date of Birth:</strong> {userData.dob}</Typography>
                            <Typography><strong>Phone Number:</strong> {userData.phone}</Typography>
                        </Box>
                    </CardContent>
                </Card>
                <Box sx={{ marginBottom: 2, padding: 2, borderRadius: 1, backgroundColor: userData.isConfirmSeatBooking ? '#e8f5e9' : '#fff3e0' }}>
                    <Typography variant="h6" textAlign="center" color={userData.isConfirmSeatBooking ? 'green' : 'orange'}>
                        {!userData.isArchived && userData.isConfirmSeatBooking ? 'Approved' : null}
                        {!userData.isArchived && !userData.isConfirmSeatBooking ? 'On Hold' : null}
                    </Typography>
                    {userData?.isArchived ? <Typography variant="h6" textAlign="center" color='red'>Cancelled</Typography> : null}
                    <Typography textAlign="center">
                        {!userData.isArchived && userData.isConfirmSeatBooking
                            ? 'Welcome to Mahadev ke Dewane tour of 2k24 Mukutmanipur trip with itineraries of these days.'
                            : null}
                        {!userData.isArchived && !userData.isConfirmSeatBooking
                            ? 'Thank you for your request! Our team is currently reviewing it and will take action shortly. In the meantime, we appreciate your patience and encourage you to stay tuned for updates!'
                            : null}
                    </Typography>
                    {userData.isArchived ?
                        <Typography textAlign="center">
                            We're sorry to inform you that your seat booking has been canceled.
                        </Typography> : null}
                </Box>

                {shouldShowAnnouncements && (
                    <Box sx={{ marginBottom: 2 }}>
                        <audio ref={audioRef} src={announcementMusic} autoPlay style={{ display: 'none' }} />
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
                <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        </Fade>
    );
};

export default UserDetails;
