import React, { useContext } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import UserContext from '../contexts/UserContext';

function UserProfile() {
    const { user } = useContext(UserContext);

    return (
        <Container style={{ marginTop: '50px' }}>
            <Row className="justify-content-center">
                <Col md={6} className="text-center">
                    <Image src={user.pfp} alt={user.firstName} roundedCircle style={{ width: '150px', height: '150px' }} />
                </Col>
                <Col md={6}>
                    <h5 className="my-3">{user.firstName} {user.lastName}</h5>
                    <p className="my-2"><strong>Email:</strong> {user.email}</p>
                    <p className="my-2"><strong>Gender:</strong> {user.gender}</p>
                    <p className="my-2"><strong>Birthday:</strong> {user.birthday}</p>
                    <p className="my-2"><strong>User Type:</strong> {user.usertype}</p>
                </Col>
            </Row>
        </Container>
    );
}

export default UserProfile;
