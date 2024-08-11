import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, TextField, Button } from '@mui/material';
import http from '../http';
import dayjs from 'dayjs';
import { format } from 'date-fns';

function formatTime24to12(time24hr) {
    const [hours, minutes] = time24hr.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return format(date, 'hh:mm a');
}

function TicketDetails() {
    const { id } = useParams(); // Get the ticket ID from the URL
    const [ticket, setTicket] = useState(null);
    const [userMap, setUserMap] = useState({});
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    // Function to get user details from userMap
    const getUserDetail = (userId, detail) => {
        const user = userMap[userId];
        if (user) {
            switch (detail) {
                case 'fullName':
                    return `${user.firstName} ${user.lastName}`;
                case 'email':
                    return user.email;
                case 'gender':
                    return user.gender;
                case 'birthday':
                    return dayjs(user.birthday).format('DD MMM YYYY');
                default:
                    return 'Unknown Detail';
            }
        }
        return 'Unknown User';
    };

    // Fetch ticket details and user details
    useEffect(() => {
        http.get(`/volunteer/${id}`)
            .then((res) => {
                setTicket(res.data);
                return http.get('/user/allUsers'); // Fetch all users to populate userMap
            })
            .then((res) => {
                const users = res.data.reduce((map, user) => {
                    map[user.id] = user;
                    return map;
                }, {});
                setUserMap(users);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [id]);

    // Handle sending a message
    const handleSendMessage = () => {
        // Replace this with your actual message sending logic
        http.post('/send-message', { ticketId: id, message })
            .then(() => {
                setSuccess(true);
                setMessage(''); // Clear message after sending
            })
            .catch(() => setSuccess(false));
    };

    if (!ticket || Object.keys(userMap).length === 0) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Volunteer Ticket Details
            </Typography>
            <Card>
                <CardContent>
                    <Typography variant="h6">{ticket.title}</Typography>
                    <Typography><strong>Full Name:</strong> {getUserDetail(ticket.userId, 'fullName')}</Typography>
                    <Typography><strong>Email:</strong> {getUserDetail(ticket.userId, 'email')}</Typography>
                    <Typography><strong>Gender:</strong> {getUserDetail(ticket.userId, 'gender')}</Typography>
                    <Typography><strong>Birthday:</strong> {getUserDetail(ticket.userId, 'birthday')}</Typography>
                    <Typography><strong>Time Available:</strong> {formatTime24to12(ticket.timeAvailable)}</Typography>
                    <Typography><strong>Date Available:</strong> {dayjs(ticket.dateAvailable).format('DD MMM YYYY')}</Typography>
                    <Typography><strong>Service Type:</strong> {ticket.serviceType}</Typography>
                    <Typography><strong>Comments:</strong> {ticket.comments}</Typography>
                    <Typography><strong>Duration:</strong> {ticket.duration} hours</Typography>
                    <Typography><strong>Contact Info:</strong> {ticket.contactInfo}</Typography>

                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label="Message to User"
                            multiline
                            rows={4}
                            fullWidth
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendMessage}
                            sx={{ mt: 2 }}
                        >
                            Send Message
                        </Button>
                        {success && <Typography color="success.main" sx={{ mt: 2 }}>Message sent successfully!</Typography>}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default TicketDetails;
