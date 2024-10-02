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
    Backdrop,
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { FamilyMember } from '../../common/user';

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
    const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
   
    const [currentSeat, setCurrentSeat] = useState<any>({
        seatNumber: '',
        seatDetails: '',
        seatStatus: true,
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const fetchSeats = async () => {
        setLoading(true);
        try{
           
        const response = await fetch( `${process.env.REACT_APP_API_URL}/api/busseatdetals/`);
        const data = await response.json();
        const sortedData = data.sort((a:any, b:any) => a?.seatNumber - b.seatNumber);
        setSeats(sortedData);
        }
        catch (error) {
            console.error('Error fetching active seats:', error);
        }
        finally{
            setLoading(false);
        }
        
        
    };

    useEffect(() => {
        
        fetchSeats();
    }, []);

    const handleOpen = (seat?:any ) => {
        setCurrentSeat({ seatNumber: seat?.seatNumber? seat?.seatNumber : " ", seatDetails: seat?.seatDetails ?seat?.seatDetails:"Window" , seatStatus: seat?.seatStatus });
        setEditMode(!!seat?.seatNumber);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentSeat({ seatNumber: '', seatDetails: 'Window', seatStatus: true });
        setEditMode(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setDeleteSnackbarOpen(false);
    };
    const handleSubmit = async () => {
        const url = editMode
            ?  `${process.env.REACT_APP_API_URL}/api/busseatdetals/update`
            :  `${process.env.REACT_APP_API_URL}/api/busseatdetals/create`;
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

    const handleDeleteOpen = (seat: any) => {
        setCurrentSeat(seat);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteConfirmOpen(false);
        setCurrentSeat({ seatNumber: '', seatDetails: 'Window', seatStatus: true });
    };

    const handleDeleteConfirm = async () => {
        const response = await fetch( `${process.env.REACT_APP_API_URL}/api/busseatdetals/delete/${currentSeat.seatNumber}`, {
            method: 'GET',
        });

        if (response.ok) {
            await fetchSeats(); // Refresh the seat list after deletion
            setDeleteConfirmOpen(false);
            setDeleteSnackbarOpen(true);
        } else {
            console.error('Failed to delete seat');
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
                            <TableRow key={seat?.seatNumber}>
                                <StyledTableCell>{`${seat?.seatNumber} - ${seat.seatDetails}`}</StyledTableCell>
                                <StyledTableCell>{seat?.seatStatus ? 'Available' : 'Unavailable'}</StyledTableCell>
                                <StyledTableCell align="right">
                                    <IconButton disabled={!seat?.seatStatus} onClick={() => handleOpen(seat)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteOpen(seat)} sx={{ color: 'red' }}>
                                        <DeleteIcon />
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

            {/* Delete Confirmation Dialog */}
            <StyledDialog open={deleteConfirmOpen} onClose={handleDeleteClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete seat number {currentSeat.seatNumber}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="secondary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="primary">Confirm</Button>
                </DialogActions>
            </StyledDialog>

            {/* Snackbar for notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    Seat details updated successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={deleteSnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    Seat deleted successfully!
                </Alert>
            </Snackbar>
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default SeatDetails;


