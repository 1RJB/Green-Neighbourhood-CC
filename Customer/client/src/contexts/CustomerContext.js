import { createContext } from 'react';

const CustomerContext = createContext({
  customer: null,
  setCustomer: () => {}
});

export default CustomerContext;