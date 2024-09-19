import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Tab,
    Tabs,
    Typography,
    useTheme,
    styled,
} from '@mui/material';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    position: 'relative',
    transition: 'background-color 0.3s',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'scale(1.1)',
    },
}));

const TabContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    },
}));

const AdminPanel: React.FC = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ flexGrow: 1, padding: theme.spacing(2) }}>
            <StyledAppBar position="static">
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    textColor="inherit"
                    indicatorColor="secondary"
                    sx={{
                        flexWrap: 'wrap', // Allows wrapping of tabs on smaller screens
                    }}
                >
                    <StyledTab label="Registration" />
                    <StyledTab label="Seat Details" />
                    <StyledTab label="Budget" />
                    <StyledTab label="Menu" />
                    <StyledTab label="Letsee" />
                </Tabs>
            </StyledAppBar>
            <TabContent>
                {activeTab === 0 && (
                    <Typography variant="h6">Registration Content</Typography>
                )}
                {activeTab === 1 && (
                    <Typography variant="h6">Seat Details Content</Typography>
                )}
                {activeTab === 2 && (
                    <Typography variant="h6">Budget Content</Typography>
                )}
                {activeTab === 3 && (
                    <Typography variant="h6">Menu Content</Typography>
                )}
                {activeTab === 4 && (
                    <Typography variant="h6">Letsee Content</Typography>
                )}
            </TabContent>
        </Box>
    );
};

export default AdminPanel;
