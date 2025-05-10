// rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import faqReducer from './faqReducer';
import certificateReducer from './certificateReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  faqs: faqReducer,
  certificates: certificateReducer
  // Add more reducers if needed
});

export default rootReducer;
