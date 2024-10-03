import React, {  useEffect, useState } from 'react';
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
    MenuItem,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

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

interface FamilyWiseCost {
    expectedCost?: string;
    paid?: string;
    due?: string;
}

interface IUser {
    _id: string;
    rName: string;
    email: string;
    familyMembers: FamilyMember[];
    isConfirmSeatBooking: boolean;
    isArchived: boolean;
    familyWiseCost?: FamilyWiseCost

}

const SeatConfirmation: React.FC = () => {
    const userData = useSelector((state: RootState) => state.user.userData) as IUser | null;
    const theme = useTheme();
    const [users, setUsers] = useState<IUser[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [selectedUserBeforeUpdate, setSelectedUserBeforeUpdate] = useState<IUser | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [activeSeats, setActiveSeats] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const fetchActiveSeats = async () => {
        setLoading(true);
   
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/busseatdetals/`);
            if (!response.ok) throw new Error('Failed to fetch active seats');
            const data = await response.json();
            // const filteredSeats = data.filter((seat: any) => seat.seatStatus === true);
            setActiveSeats(data);
        } catch (error) {
            console.error('Error fetching active seats:', error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        const fetchUsers = async () => {

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/`);
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                const filteredUsers = data.filter(
                    (user: IUser) => (user.isConfirmSeatBooking && !user.isArchived) &&   user.hasOwnProperty("familyWiseCost") && user?.familyWiseCost?.paid!==" "
                );
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };



        fetchUsers();
        fetchActiveSeats();
    }, []);

    const handleEditClick = (user: IUser) => {
        setSelectedUserBeforeUpdate(JSON.parse(JSON.stringify(user))); // Clone the user object
        setSelectedUser({ ...user }); // Create a shallow copy of the user
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        setSelectedUserBeforeUpdate(null);
    };

    const handleUpdate = async () => {

        if (!selectedUser) return;

        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/edit/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser),
            });

            if (!response.ok) throw new Error('Failed to update user');
             
            const seatsToActivate: any[] = [];
        const seatsToDeactivate: any[] = [];

        // Check which seat numbers have changed
        selectedUser.familyMembers.forEach((newMember: FamilyMember) => {
            const oldMember = selectedUserBeforeUpdate?.familyMembers.find(
                (member: FamilyMember) => member.name === newMember.name
            );

            if (oldMember) {
                // If seat number has changed, make the old one available
                if (oldMember.seatNumber !== newMember.seatNumber) {
                    seatsToActivate.push({
                        seatNumber: oldMember.seatNumber,
                        seatDetails: oldMember.seatPreference,
                        seatStatus: true, // Make this seat available
                    });

                    // Add the new seat to the deactivate list
                    seatsToDeactivate.push({
                        seatNumber: newMember.seatNumber,
                        seatDetails: newMember.seatPreference,
                        seatStatus: false, // Mark this seat as unavailable
                    });
                }
            }
        });


            const bulkUpdateResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/busseatdetals/bulkupdates`, {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([...seatsToActivate,...seatsToDeactivate]),
            });

            if (!bulkUpdateResponse.ok) throw new Error('Failed to bulk update seats');
            setLoading(false);
            setSnackbarMessage('Update successful!');
            setSnackbarOpen(true);
            // fetchActiveSeats();

            handleDialogClose();
        } catch (error) {
            console.error('Error updating user:', error);
            setSnackbarMessage('Update failed.');
            setSnackbarOpen(true);
        }finally{
            setLoading(false);
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
                    </TableBody>
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
                                select
                                label="Seat Number"
                                value={member.seatNumber || ''}
                                onChange={(e) => {
                                    const updatedMembers = [...selectedUser.familyMembers];
                                    updatedMembers[index].seatNumber = e.target.value;
                                    setSelectedUser({ ...selectedUser, familyMembers: updatedMembers });
                                }}
                                fullWidth
                                margin="normal"
                            >
                                {activeSeats.map(seat => (
                                    <MenuItem key={seat.seatNumber} value={seat.seatNumber}
                                    disabled={!seat.seatStatus}>
                                        {`${seat.seatNumber} - ${seat.seatDetails}`} {/* Displaying seat number and details */}
                                    </MenuItem>
                                ))}
                            </TextField>
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
                <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            </StyledDialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default SeatConfirmation;



