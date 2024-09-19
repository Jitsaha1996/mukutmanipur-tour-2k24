import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import Toaster from './Toaster';
import { setUser } from '../redux/userSlice';
import { IUser } from '../common/user';
import { RootState } from '../redux/store';

// Styled Box for form
const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.02)',
    },
}));

const seatPreferences = [
    'Window Seat',
    'Middle',
    'Front',
    'Back',
    'No Preference'
];

const Register: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false); // Loading state
    const userData = useSelector((state: RootState) => state.user.userData) as IUser | null;
    const [toasterOpen, setToasterOpen] = useState(false);
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterSeverity, setToasterSeverity] = useState<'success' | 'error'>('success');
    const [formData, setFormData] = useState<IUser>({
        rName: '',
        email: '',
        dob: '',
        phone: '',
        password: '',
        confirmPassword: '',
        pic: '',
        familyMembers: [{ name: '', seatPreference: '', seatNumber: '' }]
    });

    const [numFamilyMembers, setNumFamilyMembers] = useState(1);
    const [isPhotoUploaded, setIsPhotoUploaded] = useState(false); // New state for photo upload status

    useEffect(() => {
        if (userData) {
            navigate("/user-details");
        }
    }, [userData, navigate]);

    const handleChange = (e: any, index?: number) => {
        const { name, value } = e.target;

        if (index !== undefined) {
            const updatedFamilyMembers = [...formData.familyMembers];
            updatedFamilyMembers[index] = {
                ...updatedFamilyMembers[index],
                [name]: value,
            };
            setFormData({ ...formData, familyMembers: updatedFamilyMembers });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFamilyMembersChange = (e: any) => {
        const value = Number(e.target.value);
        setNumFamilyMembers(value);
        const familyMembers = Array.from({ length: value }, () => ({ name: '', seatPreference: '', seatNumber: '' }));
        setFormData({ ...formData, familyMembers });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, pic: reader.result as string });
                setToasterOpen(true);
                setToasterSeverity("success");
                setToasterMessage("Photo Uploaded!!");
                setIsPhotoUploaded(true); // Update the state to reflect photo upload
                setTimeout(() => setToasterOpen(false), 2000); // Delay toaster close
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCloseToaster = () => {
        setToasterOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (formData.password !== formData.confirmPassword) {
            setToasterMessage("Passwords do not match");
            setToasterSeverity('error');
            setToasterOpen(true);
            return;
        }

        try {
            const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    isArchived: false,
                }),
            });

            if (!response.ok) throw new Error('Registration failed');
            const userData = await response.json();
            dispatch(setUser(userData)); // Dispatch user data to Redux store
            
            setToasterMessage("Registration successful!");
            setToasterSeverity('success');
            setToasterOpen(true);

            // Use a timeout to delay the navigation so that toaster can show
            setTimeout(() => {
                setLoading(false); // Stop loading
                navigate('/user-details');
            }, 1500); 

            setFormData({
                rName: '',
                email: '',
                dob: '',
                phone: '',
                password: '',
                confirmPassword: '',
                pic: '',
                familyMembers: [{ name: '', seatPreference: '', seatNumber: '' }]
            });
            setNumFamilyMembers(1);
            setIsPhotoUploaded(false); // Reset photo upload state after registration
        } catch (error: any) {
            setToasterMessage(error.message);
            setToasterSeverity('error');
            setToasterOpen(true);
            setLoading(false); 
        }
    };

    return (
        <StyledBox>
            <Typography variant="h4" gutterBottom>
                MukutManipur 2k24 Picnic!!
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="rName"
                        variant="outlined"
                        value={formData.rName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        variant="outlined"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        variant="outlined"
                        value={formData.dob}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        variant="outlined"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        variant="outlined"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <FormControl fullWidth variant="outlined">
                        <InputLabel >Number of Family Members</InputLabel>
                        <Select
                            value={numFamilyMembers}
                            onChange={handleFamilyMembersChange}
                            sx={{ marginTop: "20px" }}
                        >
                            {Array.from({ length: 10 }, (_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    {i + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {formData.familyMembers.map((member, index) => (
                        <Box key={index} marginTop={2}>
                            <Typography variant="h6">Family Member {index + 1}</Typography>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                variant="outlined"
                                value={member?.name}
                                onChange={(e) => handleChange(e, index)}
                                data-index={index}
                                required
                            />
                            <FormControl fullWidth variant="outlined" style={{ marginTop: theme.spacing(2) }}>
                                <InputLabel>Seat Preference</InputLabel>
                                <Select
                                    name="seatPreference"
                                    value={member.seatPreference}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                >
                                    {seatPreferences.map((preference) => (
                                        <MenuItem key={preference} value={preference}>
                                            {preference}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    ))}
                    <Box sx={{ marginY: "20px" }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="upload-picture"
                            type="file"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="upload-picture">
                            <Button
                                variant="contained"
                                component="span"
                                sx={{
                                    backgroundColor: isPhotoUploaded ? 'green' : theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: isPhotoUploaded ? 'darkgreen' : theme.palette.primary.dark,
                                    },
                                }}
                            >
                                Upload Picture
                            </Button>
                        </label>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            mt: 2,
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.main,
                                transform: 'scale(1.05)',
                            },
                        }}
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                </Box>
            </form>
            <Toaster
                open={toasterOpen}
                message={toasterMessage}
                severity={toasterSeverity}
                onClose={handleCloseToaster}
            />
        </StyledBox>
    );
};

export default Register;
