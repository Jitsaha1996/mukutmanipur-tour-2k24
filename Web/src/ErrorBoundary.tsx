import React, { Component, ErrorInfo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { styled } from '@mui/system';
import { keyframes } from '@mui/system';
import ErrorHandler from './ErrorHandling';
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


interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error occurred:', error, errorInfo);
        // Optionally log error to an external service
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorHandler 
                    message="We're working to fix this issue." 
                    onRetry={() => window.location.reload()} // or handle a specific retry logic
                />
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
