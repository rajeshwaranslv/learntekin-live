const initialState = {
    list: [],
  };
  
  const internshipListINGReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_INTERNSHIPS":
        return { ...state, list: action.payload };
  
      default:
        return state;
    }
  };
  
  export default internshipListReducer;
  