import React, { useEffect, useReducer, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  addPost,
  updatePost,
  deletePost,
  subscribeToPosts,
} from "../actions/postsActions";
import { message } from "antd";
import BlogPostForm from "./PostForm";
import BlogPostList from "./PostList";

const initialState = {
  posts: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_POSTS":
      return { ...state, posts: action.payload, loading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };
    default:
      return state;
  }
}

export default function BlogManagement() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Auth state listener to get user info
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            name: user.displayName || "No Name",
            email: user.email,
            role: "viewer",
          });
        }
        const freshDoc = await getDoc(userRef);
        setCurrentUser({ id: user.uid, ...freshDoc.data() });
      } else {
        setCurrentUser(null);
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time subscription to posts
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToPosts((livePosts) => {
      dispatch({ type: "SET_POSTS", payload: livePosts });
    });
    return () => unsubscribe();
  }, [currentUser]);

  if (loadingUser) return <div>Loading...</div>;
  if (!currentUser) return <div>Please log in</div>;

  const canAddPost = currentUser.role === "admin";

  const handleDeleteComment = async (post, commentIndex) => {
    try {
      const updatedComments = [...(post.comments || [])];
      updatedComments.splice(commentIndex, 1);
      await updatePost(post.id, { comments: updatedComments });
      dispatch({
        type: "UPDATE_POST",
        payload: { ...post, comments: updatedComments },
      });
      message.success("Comment deleted.");
    } catch (err) {
      message.error("Failed to delete comment.");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: 20 }}>
    

      {canAddPost && (
        <BlogPostForm
          currentUser={currentUser}
          onAdd={async (postData) => {
            const tempPost = {
              ...postData,
              id: "temp-" + Date.now(),
              user: {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
              },
              createdAt: new Date().toISOString(),
              likes: 0,
              dislikes: 0,
              shares: 0,
              comments: [],
            };

            dispatch({ type: "ADD_POST", payload: tempPost });

            try {
              const newPost = await addPost(postData);
              dispatch({ type: "UPDATE_POST", payload: newPost });
              message.success("Post added!");
            } catch (err) {
              message.error(err.message);
              dispatch({ type: "DELETE_POST", payload: tempPost.id });
            }
          }}
        />
      )}

      <BlogPostList
        posts={state.posts}
        currentUser={currentUser}
        onLike={async (post) => {
          const updated = { ...post, likes: (post.likes || 0) + 1 };
          await updatePost(post.id, { likes: updated.likes });
          dispatch({ type: "UPDATE_POST", payload: updated });
        }}
        onDislike={async (post) => {
          const updated = { ...post, dislikes: (post.dislikes || 0) + 1 };
          await updatePost(post.id, { dislikes: updated.dislikes });
          dispatch({ type: "UPDATE_POST", payload: updated });
        }}
        onShare={async (post) => {
          const updated = { ...post, shares: (post.shares || 0) + 1 };
          await updatePost(post.id, { shares: updated.shares });
          dispatch({ type: "UPDATE_POST", payload: updated });
        }}
        onComment={async (post, text) => {
          const newComment = {
            text,
            user: {
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
            },
            createdAt: new Date().toISOString(),
          };
          const updatedComments = [...(post.comments || []), newComment];
          await updatePost(post.id, { comments: updatedComments });
          dispatch({
            type: "UPDATE_POST",
            payload: { ...post, comments: updatedComments },
          });
        }}
        onDeletePost={async (postId) => {
          try {
            await deletePost(postId);
            dispatch({ type: "DELETE_POST", payload: postId });
            message.success("Post deleted.");
          } catch (err) {
            message.error("Failed to delete post.");
          }
        }}
        onDeleteAllComments={async (post) => {
          try {
            await updatePost(post.id, { comments: [] });
            dispatch({ type: "UPDATE_POST", payload: { ...post, comments: [] } });
            message.success("All comments deleted.");
          } catch (err) {
            message.error("Failed to delete comments.");
          }
        }}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}
