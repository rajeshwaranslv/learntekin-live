import { db } from "../../firebase"; // compat Firestore instance

export const VERIFY_CERTIFICATE = "VERIFY_CERTIFICATE";

export const verifyCertificate = (certificateId) => async (dispatch) => {
  try {
    const querySnapshot = await db
      .collection("certificates")
      .where("certificateId", "==", certificateId)
      .get();

    if (!querySnapshot.empty) {
      const certificate = querySnapshot.docs[0].data();
      dispatch({ type: VERIFY_CERTIFICATE, payload: certificate });
      return certificate;
    } else {
      return Promise.reject(new Error("Certificate not found"));
    }
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return Promise.reject(error);
  }
};
