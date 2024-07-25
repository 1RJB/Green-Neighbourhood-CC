// src/contexts/UserContext.js
import { createContext } from 'react';

const UserContext = createContext({
  user: null,
  userType: null,
  setUser: () => {},
  setUserType: () => {}
});

export default UserContext;
