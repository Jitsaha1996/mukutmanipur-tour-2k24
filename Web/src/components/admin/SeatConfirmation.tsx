import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Snackbar,
    useTheme,
    styled,
    TableContainer,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '90%',
        margin: 'auto',
    },
}));

interface FamilyMember {
    name: string;
    seatPreference: string;
    seatNumber?: string;
}

interface IUser {
    _id: string;
    rName: string;
    email: string;
    familyMembers: FamilyMember[];
    isConfirmSeatBooking: boolean;
    isArchived: boolean;
}

const SeatConfirmation: React.FC = () => {
    const theme = useTheme();
    const [users, setUsers] = useState<IUser[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/users/');
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                const filteredUsers = data.filter(
                    (user: IUser) => user.isConfirmSeatBooking && !user.isArchived
                );
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = (user: IUser) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleUpdate = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/users/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser),
            });

            if (!response.ok) throw new Error('Failed to update user');

            setSnackbarMessage('Update successful!');
            setSnackbarOpen(true);
            handleDialogClose();
        } catch (error) {
            console.error('Error updating user:', error);
            setSnackbarMessage('Update failed.');
            setSnackbarOpen(true);
        }
    };

    return (
        <Box sx={{ padding: theme.spacing(2) }}>
            <Typography variant="h4" gutterBottom>
                Seat Confirmation
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Details</StyledTableCell>
                            <StyledTableCell>Family Members</StyledTableCell>
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
                                    {user.familyMembers.length}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <IconButton onClick={() => handleEditClick(user)}>
                                        <EditIcon />
                                    </IconButton>
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>``````
                </Table>
            </TableContainer>

            <StyledDialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Edit Family Members</DialogTitle>
                <DialogContent>
                    {selectedUser && selectedUser.familyMembers.map((member, index) => (
                        <Box key={index} sx={{ marginBottom: 2 }}>
                            <TextField
                                label="Member Name"
                                value={member.name}
                                disabled
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Seat Preference"
                                value={member.seatPreference}
                                disabled
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Seat Number"
                                value={member.seatNumber || ''}
                                onChange={(e) => {
                                    const updatedMembers = [...selectedUser.familyMembers];
                                    updatedMembers[index].seatNumber = e.target.value;
                                    setSelectedUser({ ...selectedUser, familyMembers: updatedMembers });
                                }}
                                fullWidth
                                margin="normal"
                            />
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </StyledDialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default SeatConfirmation;
