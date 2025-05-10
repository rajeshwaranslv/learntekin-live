const initialState = {
    list: [],
  };
  
  const applicationFormReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_APPLICATIONS":
        return { ...state, list: action.payload };
      default:
        return state;
    }
  };
  
  export default applicationFormReducer;
  