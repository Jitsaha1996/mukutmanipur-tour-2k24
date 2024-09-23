import React, { useEffect, useState } from 'react';
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
    CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import Toaster from './Toaster';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { RootState } from '../redux/store';
import { IUser } from '../common/user';

const Login: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isForgetPassword, setIsForgetPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const [toasterOpen, setToasterOpen] = useState(false);
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterSeverity, setToasterSeverity] = useState<'success' | 'error'>('success');
    const userData = useSelector((state: RootState) => state.user.userData) as IUser | null;

    useEffect(() => {
        if (userData) {
            navigate("/user-details");
        }
    }, [userData, navigate]);

    const handleCloseToaster = () => {
        setToasterOpen(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, password }),
            });

            if (!response.ok) {
                setToasterMessage("Invalid phone number or password");
                setToasterSeverity('error');
                setToasterOpen(true);
                throw new Error('Invalid phone number or password');
            }

            const data = await response.json();
            dispatch(setUser(data));
            setToasterMessage("Login successful!");
            setToasterSeverity('success');
            setToasterOpen(true);

            setTimeout(() => {
                setLoading(false);
                navigate('/user-details');
            }, 1500);

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleForgetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/forgetpassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, newPassword }),
            });

            if (!response.ok) {
                setToasterMessage("Error updating password");
                setToasterSeverity('error');
                setToasterOpen(true);
                throw new Error('Error updating password');
            }

            setToasterMessage("Password changed successfully!");
            setToasterSeverity('success');
            setToasterOpen(true);

            setTimeout(() => {
                setIsForgetPassword(false);
                setLoading(false);
                navigate('/login'); // Redirect to login page
            }, 1500);

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
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
                    {isForgetPassword ? 'Reset Password' : 'Login'}
                </Typography>
                {error && (
                    <Typography color="error" textAlign="center" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={isForgetPassword ? handleForgetPassword : handleLogin} sx={{ mt: 2 }}>
                    {isForgetPassword ? (
                        <>
                            <TextField
                                label="Phone Number"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                disabled={loading}
                                sx={{
                                    transition: '0.3s',
                                    '&:hover': { transform: 'scale(1.02)' },
                                }}
                            />
                            <TextField
                                label="New Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={loading}
                                sx={{
                                    transition: '0.3s',
                                    '&:hover': { transform: 'scale(1.02)' },
                                }}
                            />
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                                sx={{
                                    transition: '0.3s',
                                    '&:hover': { transform: 'scale(1.02)' },
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <TextField
                                label="Phone Number"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                disabled={loading}
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
                                disabled={loading}
                                sx={{
                                    transition: '0.3s',
                                    '&:hover': { transform: 'scale(1.02)' },
                                }}
                            />
                        </>
                    )}
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
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : (isForgetPassword ? 'Reset Password' : 'Login')}
                    </Button>
                </Box>
                <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                        {isForgetPassword ? (
                            <Typography variant="body2">
                                Remembered your password?{' '}
                                <Button onClick={() => setIsForgetPassword(false)} color="primary">
                                    Login
                                </Button>
                            </Typography>
                        ) : (
                            <>
                             <Typography variant="body2">
                                Forgot your password?{' '}
                                <Button onClick={() => setIsForgetPassword(true)} color="primary">
                                    Reset
                                </Button>
                            </Typography>
                        <Typography variant="body2">
                        Don't have an account?{' '}
                        <Button onClick={() => navigate('/register')} color="primary">
                            Register
                        </Button>
                    </Typography>
                            </>
                           
                            
                        )}
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
