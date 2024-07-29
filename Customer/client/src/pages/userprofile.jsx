import React, { useContext } from 'react';
import { Box, Typography, Avatar, Grid } from '@mui/material';
import UserContext from '../contexts/UserContext';

const UserProfile = () => {
    const { user } = useContext(UserContext);

    return (
        <Box sx={{ marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', padding: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border:'1px solid black'}}>
                    <Avatar src={user.pfp} alt={user.firstName} sx={{ width: 250, height: 250 }} />
                </Grid>
                <Grid item xs={8}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',border:'1px solid black' }}>
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
                </Grid>
            </Grid>
        </Box>
    );
}

export default UserProfile;
