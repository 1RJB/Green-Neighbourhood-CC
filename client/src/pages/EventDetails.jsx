import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { CalendarToday, AccessTime } from '@mui/icons-material';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import http from '../http';
import global from '../global';
import './EventDetails.css'; // Import CSS for EventDetails component styling

function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        http.get(`/event/${id}`).then((res) => {
            setEvent(res.data);
        }).catch((error) => {
            console.error("Error fetching event details:", error);
        });
    }, [id]);

    const handleParticipate = () => {
        if (user) {
            // Implement participation logic here
            console.log("Participate in event:", event.title);
        } else {
            // Handle user not logged in
            navigate('/login'); // Redirect to login if not authenticated
        }
    };

    return (
        <Box>
            {event ? (
                <Card>
                    <div className="event-details-content">
                        <div className="event-image-container">
                            {event.imageFile && (
                                <img
                                    alt="event"
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                                    className="event-image"
                                />
                            )}
                        </div>
                        <CardContent>
                            <Typography variant="h4" sx={{ mb: 2 }}>
                                {event.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CalendarToday sx={{ mr: 1 }} />
                                <Typography>
                                    {dayjs(event.createdAt).format(global.datetimeFormat)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AccessTime sx={{ mr: 1 }} />
                                <Typography>
                                    {event.endDate && event.endTime ? dayjs(`${event.endDate} ${event.endTime}`).format(global.datetimeFormat) : 'N/A'}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1">
                                    {event.description}
                                </Typography>
                            </Box>
                            {user && (
                                <Button variant="contained" color="primary" onClick={handleParticipate}>
                                    Participate
                                </Button>
                            )}
                        </CardContent>
                    </div>
                </Card>
            ) : (
                <Typography variant="h6">Loading...</Typography>
            )}
        </Box>
    );
}

export default EventDetails;
