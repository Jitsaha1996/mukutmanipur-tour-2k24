import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Modal,
    TextField,
    Backdrop,
    CircularProgress,
    IconButton,
    Pagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Fade from '@mui/material/Fade';
import EditIcon from '@mui/icons-material/Edit';
import { IUser } from '../../common/user';

const PaymentCell = styled(Box)(({ type }: { type: string }) => ({
    textAlign: 'center',
    fontWeight: 'bold',
    color: type === 'expected' ? 'orange' : type === 'paid' ? 'green' : 'red',
    transition: 'color 0.3s',
}));

const UserCard = styled(Box)(({ theme }) => ({
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: 16,
    position: 'relative',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: theme.shadows[3],
    },
}));

// const Typography = styled(Box)(({ theme }) => ({
//     textAlign: 'center',
//     fontWeight: 'bold',
//     color: type === 'seatdetails' ? 'orange' : type === 'paid' ? 'green' : 'red',
//     transition: 'color 0.3s',
// }));

const UserPayment: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<IUser|null>(null);
    const [paid, setPaid] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                 
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
                const data = await response.json();
                
                // Filter users with isConfirmSeatBooking set to true
                const confirmedUsers = data.filter((user: any) => user.isConfirmSeatBooking);
                setUsers(confirmedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setPaid(user?.familyWiseCost?.paid || '');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    const handleUpdatePaymentInfo = async () => {
        if (selectedUser) {
            const email = selectedUser.email;
            const payload = {
                email,
                payment: paid,
            };

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/paymentinfo`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error('Failed to update payment info');
                
                const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/`);
                const updatedData = await updatedResponse.json();
                
                // Filter again after updating to reflect changes
                const confirmedUsers = updatedData.filter((user: any) => user.isConfirmSeatBooking);
                setUsers(confirmedUsers);
            } catch (error) {
                console.error('Error updating payment info:', error);
            } finally {
                handleCloseModal();
            }
        }
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const getSeatDeatils = (seat:any[])=>{
        return seat?.map((item:any)=>{
            if(item?.seatNumber)
                return item?.seatNumber;
        }).join(",");
    }

    // Calculate users for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom textAlign="center">User Payments</Typography>
            {loading ? (
                <Backdrop open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {currentUsers.map((user) => (
                            <Grid item xs={12} sm={6} md={4} key={user.email}>
                                <UserCard>
                                    <Typography variant="h6">{`${user.rName} (${user.email})`}</Typography>
                                    <Typography variant="body1">Family Members: {user.familyMembers.length}</Typography>
                                    <Typography  color="#555555" variant="body2">Seat Numbers: {getSeatDeatils(user.familyMembers)}</Typography>
                                    <PaymentCell type="expected">
                                        Expected: {user.familyWiseCost.expectedCost}
                                    </PaymentCell>
                                    <PaymentCell type="paid">Paid: {user?.familyWiseCost?.paid}</PaymentCell>
                                    <PaymentCell type="due">Due: {user?.familyWiseCost?.due}</PaymentCell>
                                    <IconButton
                                        onClick={() => handleEditClick(user)}
                                        sx={{ position: 'absolute', top: 10, right: 10 }}
                                    >
                                        <EditIcon color="primary" />
                                    </IconButton>
                                </UserCard>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination Component */}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={Math.ceil(users.length / itemsPerPage)}
                            page={page}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </Box>
                </>
            )}

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                closeAfterTransition
            >
                <Fade in={modalOpen}>
                    <Box sx={{ bgcolor: 'white', padding: 4, borderRadius: 1, width: 300, mx: 'auto', mt: '20%', boxShadow: 3 }}>
                        <Typography variant="h6" gutterBottom>Edit Payment Info</Typography>
                        <TextField
                            label="Expected Cost"
                            value={selectedUser ? selectedUser.familyWiseCost?.expectedCost : 0}
                            fullWidth
                            disabled
                            margin="normal"
                        />
                        <TextField
                            label="Paid"
                            value={paid}
                            onChange={(e) => setPaid(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={handleCloseModal} color="error" sx={{ mr: 1 }}>Cancel</Button>
                            <Button onClick={handleUpdatePaymentInfo} variant="contained">Save</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default UserPayment;
