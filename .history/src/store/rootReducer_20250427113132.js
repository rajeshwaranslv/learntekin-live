// rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';

import internshipListingReducer from './internshipListingReducer';
import InternshipApplicationReducer from './InternshipApplicationReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  
  internshipList:internshipListingReducer,
  internshipApplication:InternshipApplicationReducer
  // Add more reducers if needed
});

export default rootReducer;
