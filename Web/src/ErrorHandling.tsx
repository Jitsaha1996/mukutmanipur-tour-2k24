import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { styled } from '@mui/system';
import { keyframes } from '@mui/system';

// Animation for the error icon
const shake = keyframes`
  0% { transform: translate(0); }
  25% { transform: translate(-5px, 0); }
  50% { transform: translate(5px, 0); }
  75% { transform: translate(-5px, 0); }
  100% { transform: translate(0); }
`;

const ErrorContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.error.light,
    borderRadius: theme.shape.borderRadius,
    animation: `${shake} 0.5s ease-in-out`,
    margin: theme.spacing(2),
}));

const ErrorButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    '&:hover': {
        backgroundColor: theme.palette.error.dark,
    },
}));

interface ErrorHandlerProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ message = 'Something went wrong. Please try again later.', onRetry }) => {
    return (
        <ErrorContainer>
            <ErrorOutline style={{ fontSize: '50px', color: '#d32f2f', animation: `${shake} 0.5s ease-in-out` }} />
            <Typography variant="h5" color="error" gutterBottom>
                Oops!
            </Typography>
            <Typography variant="body1" align="center" style={{ marginBottom: '16px' }}>
                {message}
            </Typography>
            {onRetry && (
                <ErrorButton variant="contained" onClick={onRetry}>
                    Retry
                </ErrorButton>
            )}
        </ErrorContainer>
    );
};

export default ErrorHandler;
