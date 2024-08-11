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

    const handleAddToCalendar = () => {
        const eventStartDate = dayjs(event.eventDate).format('YYYYMMDDTHHmmss');
        const eventEndDate = dayjs(event.endDate).format('YYYYMMDDTHHmmss');
        const eventTitle = encodeURIComponent(event.title);
        const eventDescription = encodeURIComponent(event.description);
        const eventLocation = encodeURIComponent(event.location || ''); // Optional location

        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventStartDate}/${eventEndDate}&details=${eventDescription}&location=${eventLocation}`;
        
        window.open(calendarUrl, '_blank');
    };

    return (
        <Box className="view-event-container">
            <Typography variant="h4" className="event-title" sx={{ fontWeight: 'bold', mb: 3 }}>
                {event.title}
            </Typography>

            <Box className="event-content">
                {/* Left Column: Event Details */}
                <Box className="event-details">
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '30px' }}>
                        Event Details
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
                    <Button variant="outlined" color="primary" onClick={handleAddToCalendar} startIcon={<span className="material-icons">event</span>}>
                        Add to Calendar
                    </Button>
                </Box>

                {/* Right Column: Event Image and Description */}
                <Card className="event-card">
                    <CardContent>
                        <Box className="event-image-container">
                            {event.imageFile && (
                                <img
                                    alt="event"
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                                    className="event-image"
                                />
                            )}
                        </Box>
                        <Typography paragraph>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '30px' }}>
                                Event Description
                            </Typography>
                            {event.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default ViewEvent;
