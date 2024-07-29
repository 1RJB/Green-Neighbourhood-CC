import React, { useContext } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import UserContext from '../contexts/UserContext';

function UserProfile() {
    const { user } = useContext(UserContext);

    return (
        <Box sx={{ marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ marginRight: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar src={user.pfp} alt={user.firstName} sx={{ width: 100, height: 100 }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                    <strong>First Name:</strong> {user.name}
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                    <strong>Last Name:</strong> {user.lname}
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                    <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                    <strong>Gender:</strong> {user.gender}
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                    <strong>Birthday:</strong> {user.birthday}
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                    <strong>Password:</strong> {user.password}
                </Typography>
            </Box>
        </Box>
    );
}

export default UserProfile;
