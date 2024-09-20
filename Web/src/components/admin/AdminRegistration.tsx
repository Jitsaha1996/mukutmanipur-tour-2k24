import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Paper,
    useTheme,
    styled,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// Styled components for better responsiveness
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    textAlign: 'center', // Center align text in table cells
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem', // Adjust font size for smaller screens
    },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        overflowX: 'auto', // Enable horizontal scrolling on smaller screens
    },
}));

const AdminRegistration: React.FC = () => {
    const theme = useTheme();
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/users/');
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleApprove = async (user: any) => {
        const updatedFamilyMembers = user.familyMembers.map((member: any) => ({
            ...member,
            seatNumber: "", // Set seatNumber to an empty string
        }));
    
        const updatedUser = {
            ...user,
            isConfirmSeatBooking: true,
            isArchived: false,
            familyMembers: updatedFamilyMembers,
        };
    
        await updateUser(updatedUser);
    };

    const handleReject = async (user: any) => {
        const updatedFamilyMembers = user.familyMembers.map((member: any) => ({
            ...member,
            seatNumber: "", // Set seatNumber to an empty string
        }));
        const updatedUser = { ...user, isArchived: true ,isConfirmSeatBooking: false,
            familyMembers: updatedFamilyMembers,

        };
        await updateUser(updatedUser);
    };

    const updateUser = async (user: any) => {
        try {
            const response = await fetch(`https://mukutmanipur-tour-2k24.onrender.com/api/users/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) throw new Error('Failed to update user');

            // Update local state after success
            setUsers((prevUsers) =>
                prevUsers.map((u) => (u._id === user._id ? user : u))
            );
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <Box sx={{ padding: theme.spacing(2) }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                User Registration
            </Typography>
            <StyledTableContainer>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Email
                                </StyledTableCell>
                                <StyledTableCell>
                                    Seat Confirmation
                                </StyledTableCell>
                                <StyledTableCell align="right">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <StyledTableCell>
                                        {user.rName} ({user.email})
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {user.isConfirmSeatBooking ? 'Approved' : 'Pending'}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Box display="flex" justifyContent="flex-end">
                                            <IconButton
                                                onClick={() => handleApprove(user)}
                                                disabled={user.isConfirmSeatBooking}
                                                sx={{ color: 'green', '&:disabled': { color: 'grey' } }}
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleReject(user)}
                                                disabled={user.isArchived}
                                                sx={{ color: 'red', '&:disabled': { color: 'grey' } }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </StyledTableContainer>
        </Box>
    );
    
};

export default AdminRegistration;
