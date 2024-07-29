import { createContext } from 'react';

const UserContext = createContext({
  user: null,
  usertype: null,
  setUser: () => {},
  setUserType: () => {}
});

export default UserContext;
