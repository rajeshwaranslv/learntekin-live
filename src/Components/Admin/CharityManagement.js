import React, { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { useRef } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Unauthorized from "../Warnings/Unauthorized";
import "./CharityManagement.css";

const EMPTY_FORM = {
  name: "",
  image: "",
  description: "",
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE}/api/charities`;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const safeString = (value) => (typeof value === "string" ? value : "");

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () =>
      resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () =>
      reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (err) {
      payload = text;
    }
  }

  if (!response.ok) {
    const messageText = payload?.message || `Request failed (${response.status})`;
    throw new Error(messageText);
  }

  return payload;
}

export default function CharityManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState("");
  const fileInputRef = useRef(null);

  const isAdmin = useMemo(() => currentUser?.role === "admin", [currentUser]);

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

  const loadCharities = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await requestJson(API_URL);
      setCharities(Array.isArray(data) ? data : []);
    } catch (err) {
      const messageText = err.message || "Failed to load charities.";
      setError(messageText);
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser || !isAdmin) {
      return;
    }
    loadCharities();
  }, [currentUser, isAdmin, loadCharities]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "image") {
      setSelectedImageName("");
    }
  };

  const clearSelectedImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
    setSelectedImageName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      message.error("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      message.error("Image size should be under 2 MB.");
      event.target.value = "";
      return;
    }

    setUploadingImage(true);

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, image: imageDataUrl }));
      setSelectedImageName(file.name);
      message.success("Image ready for upload.");
    } catch (err) {
      message.error(err.message || "Unable to process the selected image.");
      event.target.value = "";
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSelectedImageName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: safeString(form.name).trim(),
      image: safeString(form.image).trim(),
      description: safeString(form.description).trim(),
    };

    if (!payload.name) {
      message.error("Name is required.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const updated = await requestJson(`${API_URL}/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setCharities((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
        message.success("Charity updated.");
      } else {
        const created = await requestJson(API_URL, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setCharities((prev) => [created, ...prev]);
        message.success("Charity created.");
      }

      resetForm();
    } catch (err) {
      message.error(err.message || "Failed to save charity.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (charity) => {
    setEditingId(charity._id);
    setForm({
      name: safeString(charity.name),
      image: safeString(charity.image),
      description: safeString(charity.description),
    });
    setSelectedImageName("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (charity) => {
    if (!window.confirm(`Delete "${charity.name}"?`)) {
      return;
    }

    try {
      await requestJson(`${API_URL}/${charity._id}`, { method: "DELETE" });
      setCharities((prev) => prev.filter((item) => item._id !== charity._id));
      message.success("Charity deleted.");
    } catch (err) {
      message.error(err.message || "Failed to delete charity.");
    }
  };

  if (loadingUser) {
    return <div className="charity-admin-container">Loading...</div>;
  }

  if (!currentUser) {
    return <Unauthorized />;
  }

  if (!isAdmin) {
    return (
      <div className="charity-admin-container">
        <h2>Admin Access Only</h2>
        <p>You do not have permission to manage charities.</p>
      </div>
    );
  }

  return (
    <section className="charity-admin-container">
      <div className="charity-admin-header">
        <div>
          <h1>Charity Management</h1>
          <p>Manage charity partner data served from the backend API.</p>
        </div>
        <button
          type="button"
          className="button charity-refresh"
          onClick={loadCharities}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <form className="charity-form" onSubmit={handleSubmit}>
        <div className="charity-form-row">
          <div className="charity-field">
            <label htmlFor="charity-name">Name</label>
            <input
              id="charity-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Charity name"
              required
            />
          </div>
          <div className="charity-field">
            <label htmlFor="charity-image">Image URL</label>
            <input
              id="charity-image"
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="charity-field">
          <label htmlFor="charity-image-file">Upload Image</label>
          <input
            ref={fileInputRef}
            id="charity-image-file"
            name="charity-image-file"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <small className="charity-helper-text">
            Upload JPG, PNG, or WEBP up to 2 MB. The selected file is stored in the same image field used by the charity cards.
          </small>
          {(selectedImageName || form.image) && (
            <div className="charity-image-preview">
              <div className="charity-image-preview-thumb">
                <img src={form.image} alt={form.name || "Charity preview"} />
              </div>
              <div className="charity-image-preview-copy">
                <strong>{selectedImageName || "Current image selected"}</strong>
                <span>
                  {uploadingImage
                    ? "Processing image..."
                    : "This image will be saved when you submit the form."}
                </span>
              </div>
              <button
                type="button"
                className="button charity-secondary"
                onClick={clearSelectedImage}
                disabled={uploadingImage || saving}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="charity-field">
          <label htmlFor="charity-description">Description</label>
          <textarea
            id="charity-description"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description"
          ></textarea>
        </div>

        <div className="charity-form-actions">
          <button
            type="submit"
            className="button"
            disabled={saving || uploadingImage}
          >
            {saving
              ? "Saving..."
              : uploadingImage
                ? "Preparing image..."
                : editingId
                  ? "Update Charity"
                  : "Create Charity"}
          </button>
          {editingId && (
            <button
              type="button"
              className="button charity-secondary"
              onClick={resetForm}
              disabled={saving || uploadingImage}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p className="charity-error">{error}</p>}

      <div className="charity-list">
        {loading && <p>Loading charities...</p>}
        {!loading && charities.length === 0 && (
          <p>No charities yet. Add the first one above.</p>
        )}
        {charities.map((charity) => (
          <article key={charity._id} className="charity-card-item">
            <div className="charity-card-info">
              <div className="charity-avatar">
                {charity.image ? (
                  <img src={charity.image} alt={charity.name} />
                ) : (
                  <span>{charity.name?.slice(0, 1)?.toUpperCase() || "C"}</span>
                )}
              </div>
              <div>
                <h3>{charity.name}</h3>
                <p>{charity.description || "No description provided."}</p>
              </div>
            </div>
            <div className="charity-card-actions">
              <button
                type="button"
                className="button charity-secondary"
                onClick={() => handleEdit(charity)}
              >
                Edit
              </button>
              <button
                type="button"
                className="button charity-danger"
                onClick={() => handleDelete(charity)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
