import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const getInternshipListings = () => async (dispatch) => {
  try {
    const snapshot = await getDocs(collection(db, "internships"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    dispatch({ type: "SET_INTERNSHIPS", payload: list });
  } catch (error) {
    console.error("Failed to fetch internship listings:", error);
  }
};

