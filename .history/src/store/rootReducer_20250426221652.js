// rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import faqReducer from './faqReducer';
import certificateReducer from './certificateReducer';
import internshipListingReducer from './internshipListingReducer';
import InternshipApplicationReducer from './InternshipApplicationReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  faqs: faqReducer,
  certificates: certificateReducer,
  internshipList:internshipListingReducer,
  internshipApplication:InternshipApplicationReducer
  // Add more reducers if needed
});

export default rootReducer;
