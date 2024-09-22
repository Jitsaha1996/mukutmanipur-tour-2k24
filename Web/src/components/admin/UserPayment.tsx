import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Modal,
    TextField,
    Typography,
    Backdrop,
    CircularProgress,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Fade from '@mui/material/Fade';
import EditIcon from '@mui/icons-material/Edit';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const PaymentCell = styled(TableCell)(({ type }: { type: string }) => ({
    textAlign: 'center',
    fontWeight: 'bold',
    color: type === 'expected' ? 'orange' : type === 'paid' ? 'green' : 'red',
}));

const UserPayment: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [paid, setPaid] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/users');
                const data = await response.json();
                setUsers(data);
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
        setPaid(user.familyWiseCost.paid || '');
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
                const response = await fetch('http://localhost:5000/api/users/paymentinfo', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error('Failed to update payment info');
                // Refetch users after updating
                const updatedResponse = await fetch('http://localhost:5000/api/users');
                const updatedData = await updatedResponse.json();
                setUsers(updatedData);
            } catch (error) {
                console.error('Error updating payment info:', error);
            } finally {
                handleCloseModal();
            }
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom textAlign="center">User Payments</Typography>
            {loading ? (
                <Backdrop open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name (Email)</StyledTableCell>
                                <StyledTableCell>Family Members</StyledTableCell>
                                <StyledTableCell>Payment Details</StyledTableCell>
                                <StyledTableCell>Edit</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.email}>
                                    <StyledTableCell>{`${user.rName} (${user.email})`}</StyledTableCell>
                                    <StyledTableCell>{user.familyMembers.length}</StyledTableCell>
                                    <PaymentCell type="expected">
                                        {user.familyMembers.length * 1200}
                                    </PaymentCell>
                                    <PaymentCell type="paid">{user.familyWiseCost.paid}</PaymentCell>
                                    <PaymentCell type="due">{user.familyWiseCost.due}</PaymentCell>
                                    <StyledTableCell>
                                        <IconButton onClick={() => handleEditClick(user)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
                            value={selectedUser ? selectedUser.familyMembers.length * 1200 : 0}
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
