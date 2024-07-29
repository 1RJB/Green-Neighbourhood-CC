// src/pages/UserProfile.jsx
import React, { useContext } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import UserContext from '../contexts/UserContext';

function UserProfile() {
    const { user } = useContext(UserContext);

    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={user.pfp} alt={user.firstName} sx={{ width: 100, height: 100 }} />
            <Typography variant="h5" sx={{ my: 2 }}>
                {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
                Email: {user.email}
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
                Gender: {user.gender}
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
                Birthday: {user.birthday}
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
                User Type: {user.usertype}
            </Typography>
        </Box>
    );
}

export default UserProfile;
