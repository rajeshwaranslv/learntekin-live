import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// Fetch all posts sorted by createdAt descending (not used anymore)
export const fetchPosts = async () => {
  const snapshot = await getDocs(collection(db, "posts"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
};

// Add new post with server timestamp and initial fields
export const addPost = async (postData) => {
  const docRef = await addDoc(collection(db, "posts"), {
    ...postData,
    createdAt: serverTimestamp(),
    likes: 0,
    dislikes: 0,
    shares: 0,
    comments: [],
  });
  const newDoc = await getDoc(docRef);
  return { id: docRef.id, ...newDoc.data() };
};

// Update post fields like likes, shares, comments etc.
export const updatePost = async (postId, updates) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, updates);
};

// Delete a post by id
export const deletePost = async (postId) => {
  const postRef = doc(db, "posts", postId);
  await deleteDoc(postRef);
};

// Real-time subscription to posts
export const subscribeToPosts = (callback) => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(posts);
  });
  return unsubscribe;
};
