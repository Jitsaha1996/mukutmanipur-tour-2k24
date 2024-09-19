import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    Avatar,
    Grid,
    useTheme,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import Toaster from './Toaster';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const [toasterOpen, setToasterOpen] = useState(false);
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterSeverity, setToasterSeverity] = useState<'success' | 'error'>('success');
    const handleCloseToaster = () => {
        setToasterOpen(false);
    };
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                setToasterMessage("Invalid Password");
                setToasterSeverity('error');
                setToasterOpen(true);
                throw new Error('Invalid email or password');

            }

            // Handle successful login here
            const data = await response.json();

            dispatch(setUser(data)); // Dispatch user data to Redux store
            setToasterMessage("Login successful!");
            setToasterSeverity('success');
            setToasterOpen(true);
            navigate('/user-details');
            // Navigate to the desired page after login
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, position: 'relative' }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        opacity: 0.1,
                        zIndex: 0,
                        borderRadius: 2,
                    }}
                />
                <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
                    <LockIcon />
                </Avatar>
                <Typography variant="h5" component="h1" textAlign="center">
                    Login
                </Typography>
                {error && (
                    <Typography color="error" textAlign="center" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                    <TextField
                        label="Email Address"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{
                            transition: '0.3s',
                            '&:hover': { transform: 'scale(1.02)' },
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        sx={{
                            transition: '0.3s',
                            '&:hover': { transform: 'scale(1.02)' },
                        }}
                    />
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
                    >
                        Login
                    </Button>
                </Box>
                <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                        <Typography variant="body2">
                            Don't have an account?{' '}
                            <Button onClick={() => navigate('/register')} color="primary">
                                Register
                            </Button>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
            <Toaster
                open={toasterOpen}
                message={toasterMessage}
                severity={toasterSeverity}
                onClose={handleCloseToaster}
            />
        </Container>
    );
};

export default Login;