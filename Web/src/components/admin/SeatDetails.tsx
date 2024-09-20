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
    MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
        padding: '8px',
    },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '90%',
        margin: 'auto',
    },
}));

const SeatDetails: React.FC = () => {
    const theme = useTheme();
    const [seats, setSeats] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentSeat, setCurrentSeat] = useState<any>({
        seatNumber: '',
        seatDetails: 'Window',
        seatStatus: true,
    });

    const fetchSeats = async () => {
        const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/busseatdetals/');
        const data = await response.json();
        setSeats(data);
    };

    useEffect(() => {
        fetchSeats();
    }, []);

    const handleOpen = (seat: any = { seatNumber: '', seatDetails: 'Window', seatStatus: true }) => {
        setCurrentSeat(seat);
        setEditMode(!!seat.seatNumber);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentSeat({ seatNumber: '', seatDetails: 'Window', seatStatus: true });
        setEditMode(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async () => {
        const url = editMode
            ? `https://mukutmanipur-tour-2k24.onrender.com/api/busseatdetals/update`
            : `https://mukutmanipur-tour-2k24.onrender.com/api/busseatdetals/create`;
        const method = editMode ? 'PUT' : 'POST';
        const payload = {
            seatNumber: currentSeat.seatNumber,
            seatDetails: currentSeat.seatDetails,
            seatStatus: currentSeat.seatStatus,
        };

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            await fetchSeats(); // Fetch updated seat details after add/update
            handleClose();
            setSnackbarOpen(true);
        } else {
            console.error('Failed to update seat details');
        }
    };

    return (
        <Box sx={{ padding: theme.spacing(2) }}>
            <IconButton onClick={() => handleOpen()} sx={{ marginBottom: 2, color: 'green' }}>
                <AddIcon fontSize="large" />
            </IconButton>
            <Typography variant="h4" gutterBottom>
                Seat Details
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: theme.spacing(2) }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Seat Details</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                            <StyledTableCell align="right">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {seats.map((seat) => (
                            <TableRow key={seat.seatNumber}>
                                <StyledTableCell>{`${seat.seatNumber} - ${seat.seatDetails}`}</StyledTableCell>
                                <StyledTableCell>{seat.seatStatus ? 'Available' : 'Unavailable'}</StyledTableCell>
                                <StyledTableCell align="right">
                                    <IconButton onClick={() => handleOpen(seat)}>
                                        <EditIcon />
                                    </IconButton>
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Add/Edit Seat */}
            <StyledDialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? 'Edit Seat' : 'Add Seat'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Seat Number"
                        variant="outlined"
                        value={currentSeat.seatNumber}
                        onChange={(e) => setCurrentSeat({ ...currentSeat, seatNumber: e.target.value })}
                        fullWidth
                        required
                    />
                    <TextField
                        select
                        label="Seat Details"
                        value={currentSeat.seatDetails}
                        onChange={(e) => setCurrentSeat({ ...currentSeat, seatDetails: e.target.value })}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Window">Window</MenuItem>
                        <MenuItem value="Middle">Middle</MenuItem>
                        <MenuItem value="Perimeter">Perimeter</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Status"
                        value={currentSeat.seatStatus ? 'Available' : 'Unavailable'}
                        onChange={(e) => setCurrentSeat({ ...currentSeat, seatStatus: e.target.value === 'Available' })}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Unavailable">Unavailable</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">{editMode ? 'Update' : 'Add'}</Button>
                </DialogActions>
            </StyledDialog>

            {/* Snackbar for notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    Seat details updated successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SeatDetails;
