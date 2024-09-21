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
    Backdrop,
    CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save'; // Import an icon for the export button
import { saveAs } from 'file-saver'; // npm install file-saver

// Styled components for better responsiveness
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
    },
}));

const AdminRegistration: React.FC = () => {
    const theme = useTheme();
    const [users, setUsers] = useState<any[]>([]);

    const [loading, setLoading] = useState<boolean>(true); // Loading state

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); // Set loading to true when fetching starts
            try {
                const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/users/');
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUsers();
    }, []);

    const updateSeatsStatus = async (familyMembers: any[]) => {
        const seatUpdates = familyMembers
            .filter((member) => member.seatNumber && member.seatNumber.trim() !== '')
            .map((member) => ({
                seatNumber: member.seatNumber,
                seatDetails: member.seatPreference,
                seatStatus: false,
            }));

        if (seatUpdates.length > 0) {
            try {
                const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/busseatdetals/bulkupdates', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(seatUpdates),
                });

                if (!response.ok) throw new Error('Failed to update seats');
            } catch (error) {
                console.error('Error updating seats:', error);
            }
        }
    };

    const handleUserAction = async (user: any, isApproved: boolean) => {
        const updatedFamilyMembers = user.familyMembers.map((member: any) => ({
            ...member,
            seatNumber: "", // Reset seatNumber if needed
        }));

        const updatedUser = {
            ...user,
            isConfirmSeatBooking: isApproved,
            isArchived: !isApproved,
            familyMembers: updatedFamilyMembers,
        };

        await updateUser(updatedUser);
        await updateSeatsStatus(user.familyMembers); // Update seat status if approved
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

            setUsers((prevUsers) =>
                prevUsers.map((u) => (u._id === user._id ? user : u))
            );
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const exportToCSV = () => {
        const csvData = users.flatMap(user => 
            user.familyMembers.map((member:any) => ({
                Name: user.rName,
                Email: user.email,
                DOB: user.dob,
                Phone: user.phone,
                SeatNumber: member.seatNumber || '',
                SeatPreference: member.seatPreference || '',
                IsConfirmed: user.isConfirmSeatBooking ? 'Yes' : 'No',
                IsArchived: user.isArchived ? 'Yes' : 'No',
            }))
        );

        const csvRows = [
            ['Name', 'Email', 'DOB', 'Phone', 'SeatNumber', 'SeatPreference', 'IsConfirmed', 'IsArchived'], // Header row
            ...csvData.map(row => Object.values(row)),
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'users.csv');
    };

    return (
        <Box sx={{ padding: theme.spacing(2) }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                User Registration
            </Typography>
            <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
                <IconButton
                    onClick={exportToCSV}
                    color="primary"
                    sx={{ marginLeft: 1 }} // Add some left margin
                >
                    <SaveIcon />
                </IconButton>
            </Box>
            <StyledTableContainer>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell>Seat Confirmation</StyledTableCell>
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
                                                onClick={() => handleUserAction(user, true)}
                                                disabled={user.isConfirmSeatBooking}
                                                sx={{ color: 'green', '&:disabled': { color: 'grey' } }}
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleUserAction(user, false)}
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
            {/* Loader */}
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default AdminRegistration;
