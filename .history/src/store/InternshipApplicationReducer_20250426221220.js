const initialState = {
    list: [],
  };
  
  const InternshipApplicationReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_APPLICATIONS":
        return { ...state, list: action.payload };
      default:
        return state;
    }
  };
  
  export default ;
  