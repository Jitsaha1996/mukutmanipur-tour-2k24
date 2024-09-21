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
    TextField,
    Modal,
    Backdrop,
    CircularProgress,
    Button,
    Snackbar,
    useTheme,
    styled,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

// Styled components
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

const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const Announcement: React.FC = () => {
    const theme = useTheme();
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [announcementId, setAnnouncementId] = useState<string>('');
    const [announcementDetails, setAnnouncementDetails] = useState<string>('');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://mukutmanipur-tour-2k24.onrender.com/api/announcement/');
            if (!response.ok) throw new Error('Failed to fetch announcements');
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (announcement?: any) => {
        if (announcement) {
            setIsEdit(true);
            setAnnouncementId(announcement.announcementId);
            setAnnouncementDetails(announcement.announcementDetails);
        } else {
            setIsEdit(false);
            setAnnouncementId('');
            setAnnouncementDetails('');
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setIsEdit(false);
    };

    const handleSaveAnnouncement = async () => {
        const payload = {
            announcementId,
            announcementDetails,
            announcementStatus: true,
        };

        setLoading(true);
        try {
            const method = isEdit ? 'PUT' : 'POST';
            const url = isEdit ? 'https://mukutmanipur-tour-2k24.onrender.com/api/announcement/update' : 'https://mukutmanipur-tour-2k24.onrender.com/api/announcement/create';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to save announcement');

            fetchAnnouncements();
            setSnackbarMessage(`Announcement ${isEdit ? 'updated' : 'created'} successfully!`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error saving announcement:', error);
        } finally {
            setLoading(false);
            handleCloseModal();
        }
    };

    const handleDeleteAnnouncement = async () => {
        if (!confirmDelete.id) return;

        setLoading(true);
        try {
            const response = await fetch(`https://mukutmanipur-tour-2k24.onrender.com/api/announcement/delete/${confirmDelete.id}`, {
                method: 'GET',
            });

            if (!response.ok) throw new Error('Failed to delete announcement');

            fetchAnnouncements();
            setSnackbarMessage('Announcement deleted successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting announcement:', error);
        } finally {
            setLoading(false);
            setConfirmDelete({ open: false, id: null });
        }
    };

    return (
        <Box sx={{ padding: theme.spacing(2) }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Announcements
            </Typography>
            <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
                <IconButton color="success" onClick={() => handleOpenModal()}>
                    <AddIcon />
                </IconButton>
            </Box>
            <StyledTableContainer>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Announcement ID</StyledTableCell>
                            <StyledTableCell>Announcement</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {announcements.map((announcement) => (
                            <TableRow key={announcement.announcementId}>
                                <StyledTableCell>{announcement.announcementId}</StyledTableCell>
                                <StyledTableCell>{announcement.announcementDetails}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <IconButton onClick={() => handleOpenModal(announcement)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => setConfirmDelete({ open: true, id: announcement.announcementId })}>
                                        <DeleteIcon />
                                    </IconButton>
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

            {/* Create/Update Modal */}
            <StyledModal
                open={modalOpen}
                onClose={handleCloseModal}
            >
                <Box sx={{ bgcolor: 'background.paper', padding: 3, borderRadius: 1, width: '80%', maxWidth: 400 }}>
                    <Typography variant="h6">{isEdit ? 'Update' : 'Create'} Announcement</Typography>
                    <TextField
                        label="Announcement ID"
                        value={announcementId}
                        onChange={(e) => setAnnouncementId(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isEdit}
                    />
                    <TextField
                        label="Announcement Details"
                        value={announcementDetails}
                        onChange={(e) => setAnnouncementDetails(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mt: 2 }}
                    />
                    <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button onClick={handleCloseModal} variant="outlined" color="error" sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveAnnouncement} variant="contained" color="primary">
                            {isEdit ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                </Box>
            </StyledModal>

            {/* Delete Confirmation Modal */}
            <StyledModal
                open={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, id: null })}
            >
                <Box sx={{ bgcolor: 'background.paper', padding: 3, borderRadius: 1, width: '80%', maxWidth: 400 }}>
                    <Typography variant="h6">Are you sure you want to delete this announcement?</Typography>
                    <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button onClick={() => setConfirmDelete({ open: false, id: null })} variant="outlined" color="error" sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteAnnouncement} variant="contained" color="primary">
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </StyledModal>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Box>
    );
};

export default Announcement;
