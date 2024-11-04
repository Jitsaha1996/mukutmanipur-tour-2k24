import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Modal,
    TextField,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { IUser } from '../../common/user';
import { RootState } from '../../redux/store';

const colors = ['#4caf50', '#f44336', '#2196f3', '#ffeb3b'];

const BudgetCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: theme.spacing(2),
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const Budget: React.FC = () => {
    const userData = useSelector((state: RootState) => state.user.userData) as IUser | null;
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [expense, setExpense] = useState<any>({ id: '', name: '', amount: '' });
    const [expenses, setExpenses] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        fetchUsers();
        fetchExpenses();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenses = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/budget/`);
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const totalExpectedBudget = users.reduce((sum, user) => {
        const expectedCost = parseFloat(user?.familyWiseCost?.expectedCost || '0');
        return sum + expectedCost;
    }, 0);

    const currentBudget = users.reduce((sum, user) => {
        const paid = parseFloat(user?.familyWiseCost?.paid || '0');
        return sum + paid;
    }, 0);

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.expensesValue, 0);

    const handleOpenModal = (expenseToEdit?: any) => {
        if (expenseToEdit) {
            setExpense({ id: expenseToEdit.expensesId, name: expenseToEdit.expensesDeatils, amount: expenseToEdit.expensesValue });
            setIsEditing(true);
        } else {
            setExpense({ id: '', name: '', amount: '' });
            setIsEditing(false);
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setExpense({ id: '', name: '', amount: '' });
    };

    const handleAddOrUpdateExpense = async () => {
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${process.env.REACT_APP_API_URL}/api/budget/update` : `${process.env.REACT_APP_API_URL}/api/budget/create`;
        const payload = {
            expensesId: expense.id || Date.now().toString(),
            expensesDeatils: expense.name,
            expensesValue: Number(expense.amount),
        };

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            fetchExpenses();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        try {

            await fetch(`${process.env.REACT_APP_API_URL}/api/budget/delete/${id}`, { method: 'GET' });
            fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Budget Overview
            </Typography>
            {loading ? (
                <Backdrop open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <BudgetCard>
                                <Typography variant="h5">Total Expected Budget</Typography>
                                <Typography variant="h6">{totalExpectedBudget}</Typography>
                            </BudgetCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <BudgetCard>
                                <Typography variant="h5">Current Budget</Typography>
                                <Typography variant="h6">{currentBudget}</Typography>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Current', value: currentBudget },
                                                { name: 'Remaining', value: totalExpectedBudget - currentBudget }
                                            ]}
                                            innerRadius={40}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationDuration={500}
                                            animationEasing="ease-in-out"
                                        >
                                            {colors.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </BudgetCard>
                            <BudgetCard>
                                <Typography variant="h5">Remaining Balance</Typography>
                                <Typography variant="h6">{currentBudget - totalExpenses}</Typography>
                            </BudgetCard>
                        </Grid>
                    </Grid>
                    {userData?.isAdmin && userData?.isCashier ? <ActionButton
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenModal()}
                        startIcon={<AddIcon />}
                        sx={{ mt: 3 }}
                    >
                        Add Expense
                    </ActionButton> : null}


                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Expense Name</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    {userData?.isAdmin && userData?.isCashier ?
                                        <TableCell align="right">Actions</TableCell> : null}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {expenses.map((expense, index) => (
                                    <TableRow key={expense.expensesId}>
                                        <TableCell>{expense.expensesDeatils}</TableCell>
                                        <TableCell align="right">{expense.expensesValue}</TableCell>
                                        {userData?.isAdmin && userData?.isCashier ?
                                            <TableCell align="right">
                                                <ActionButton color="primary" onClick={() => handleOpenModal(expense)} startIcon={<EditIcon />}>

                                                </ActionButton>
                                                <ActionButton color="error" onClick={() => handleDeleteExpense(expense.expensesId)} startIcon={<DeleteIcon />}>

                                                </ActionButton>
                                            </TableCell> : null
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid item xs={12} md={6}>
                            <BudgetCard>
                                <Typography variant="h5">Total Expenses</Typography>
                                <Typography variant="h6">{totalExpenses}</Typography>
                            </BudgetCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <BudgetCard>
                                <Typography variant="h5">Budget Breakdown</Typography>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Expected Budget', value: totalExpectedBudget },
                                                { name: 'Current Expenses', value: totalExpenses }
                                            ]}
                                            innerRadius={40}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationDuration={500}
                                            animationEasing="ease-in-out"
                                        >
                                            {colors.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </BudgetCard>
                        </Grid>
                    </Grid>

                    <Modal open={modalOpen} onClose={handleCloseModal}>
                        <Box sx={{ bgcolor: 'white', padding: 4, borderRadius: 2, width: 400, mx: 'auto', mt: '20%', boxShadow: 3 }}>
                            <Typography variant="h6" gutterBottom>{isEditing ? 'Edit Expense' : 'Add Expense'}</Typography>
                            <TextField
                                label="Expense Name"
                                value={expense.name}
                                onChange={(e) => setExpense({ ...expense, name: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Amount"
                                type="number"
                                value={expense.amount}
                                onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <ActionButton variant="contained" onClick={handleAddOrUpdateExpense} sx={{ mt: 2 }}>
                                {isEditing ? 'Update' : 'Add'}
                            </ActionButton>
                        </Box>
                    </Modal>
                </>
            )}
        </Box>
    );
};

export default Budget;
