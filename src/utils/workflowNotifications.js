import firebase, { db } from "../firebase";

const normalizeText = (value) => String(value || "").trim();
const normalizeEmail = (value) => normalizeText(value).toLowerCase();

const createNotification = async ({
  app,
  type,
  title,
  message,
  recipientEmail = "",
  entityId = "",
  entityName = "",
  metadata = {},
}) => {
  const payload = {
    app: normalizeText(app),
    type: normalizeText(type),
    title: normalizeText(title),
    message: normalizeText(message),
    recipientEmail: normalizeEmail(recipientEmail),
    entityId: normalizeText(entityId),
    entityName: normalizeText(entityName),
    metadata,
    read: false,
    source: "firestore",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  return db.collection("notifications").add(payload);
};

export const createAdminWorkflowNotification = (notification) =>
  createNotification({ ...notification, app: "ltin-admin" });

export const createLiveWorkflowNotification = (notification) =>
  createNotification({ ...notification, app: "learntekin-live" });
