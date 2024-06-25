import { createContext } from 'react';

const StaffContext = createContext({
  staff: null,
  setStaff: () => {}
});

export default StaffContext;