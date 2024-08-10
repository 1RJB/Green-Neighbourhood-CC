import React, { useState } from 'react';
import UserProfile from './userprofile'; 

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('profile');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return <UserProfile />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.sidebar}>
        <div
          style={activeComponent === 'profile' ? styles.activeBox : styles.box}
          onClick={() => setActiveComponent('profile')}
        >
          Profile
        </div>
        <div
          style={activeComponent === 'notifications' ? styles.activeBox : styles.box}
          onClick={() => setActiveComponent('notifications')}
        >
          Notifications
        </div>
        <div
          style={activeComponent === 'settings' ? styles.activeBox : styles.box}
          onClick={() => setActiveComponent('settings')}
        >
          Settings
        </div>
      </div>
      <div style={styles.content}>
        {renderComponent()}
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
  },
  sidebar: {
    width: '200px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  box: {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#555',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s ease',
  },
  activeBox: {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#007BFF',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s ease',
  },
  content: {
    flex: 1,
    padding: '20px',
  },
};

export default Dashboard;
