import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import dayjs from 'dayjs';
import http from '../http';
import './ViewEvent.css'; // Import CSS for ViewEvent component styling
import UserContext from '../contexts/UserContext';
import { toast } from 'react-toastify'; // Import toast for error messages

function ViewEvent() {
    const { user } = useContext(UserContext);
    const { id } = useParams(); // Get event ID from URL
    const [event, setEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch event details from the API
        http.get(`/event/${id}`)
            .then((res) => {
                setEvent(res.data);
            })
            .catch((error) => {
                console.error('Error fetching event details:', error);
            });
    }, [id]);

    if (!event) {
        return <Typography>Loading...</Typography>;
    }

    // Calculate the date one month before the event date
    const now = dayjs();
    const eventDate = dayjs(event.eventDate);
    const oneMonthBefore = eventDate.subtract(1, 'month');
    const showParticipateButton = now.isAfter(oneMonthBefore) && now.isBefore(eventDate);

    const handleParticipate = () => {
        if (user) {
            navigate('/participateevent', { state: { event: event.title } });
        } else {
            toast.error("Please log in to participate in events.");
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                {event.title}
            </Typography>
            <Card>
                <CardContent>
                    <Box sx={{ mb: 2 }}>
                        {event.imageFile && (
                            <img
                                alt="event"
                                src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                                className="event-image"
                            />
                        )}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                        Description
                    </Typography>
                    <Typography paragraph>
                        {event.description}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Details
                    </Typography>
                    <Typography paragraph>
                        <strong>Event Date:</strong> {dayjs(event.eventDate).format('MMMM D, YYYY')}
                    </Typography>
                    <Typography paragraph>
                        <strong>Event Time:</strong> {event.eventTime}
                    </Typography>
                    <Typography paragraph>
                        <strong>End Date:</strong> {dayjs(event.endDate).format('MMMM D, YYYY')}
                    </Typography>
                    <Typography paragraph>
                        <strong>End Time:</strong> {event.endTime}
                    </Typography>
                    <Typography paragraph>
                        <strong>Category:</strong> {event.category}
                    </Typography>
                    {showParticipateButton && (
                        <Button variant="contained" color="primary" onClick={handleParticipate}>
                            Participate
                        </Button>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default ViewEvent;
