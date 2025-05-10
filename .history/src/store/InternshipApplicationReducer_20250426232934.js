const initialState = {
  list: [],
  submitting: false,
  error: null,
};

const InternshipApplicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_APPLICATIONS":
      return { ...state, list: action.payload };
    case "SUBMIT_APPLICATION_START":
      return { ...state, submitting: true };
    case "SUBMIT_APPLICATION_SUCCESS":
      return { ...state, submitting: false };
    case "SUBMIT_APPLICATION_FAILURE":
      return { ...state, submitting: false, error: action.payload };
    default:
      return state;
  }
};

export default InternshipApplicationReducer;
