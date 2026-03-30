import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Unauthorized from "../Warnings/Unauthorized";
import { buildApiUrl, resolveApiAssetUrl } from "../../utils/api";
import "./CharityManagement.css";

const EMPTY_FORM = {
  name: "",
  image: "",
  description: "",
};

const API_URL = buildApiUrl("/api/charities");
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const safeString = (value) => (typeof value === "string" ? value : "");

const normalizeCharity = (value) => ({
  _id: safeString(value?._id),
  name: safeString(value?.name),
  image: safeString(value?.image),
  description: safeString(value?.description),
  imageStorage: safeString(value?.imageStorage),
});

async function requestData(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (_) {
      payload = text;
    }
  }

  if (!response.ok) {
    const messageText =
      payload?.message || payload || `Request failed (${response.status})`;
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [initialImageValue, setInitialImageValue] = useState("");
  const [imageClearedExplicitly, setImageClearedExplicitly] = useState(false);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef("");

  const isAdmin = useMemo(() => currentUser?.role === "admin", [currentUser]);

  const clearObjectPreview = useCallback(() => {
    if (!objectUrlRef.current) {
      return;
    }
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = "";
  }, []);

  useEffect(() => () => clearObjectPreview(), [clearObjectPreview]);

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

  const syncPreview = useCallback(
    (value) => {
      clearObjectPreview();
      setImagePreview(resolveApiAssetUrl(value));
    },
    [clearObjectPreview]
  );

  const loadCharities = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await requestData(API_URL);
      setCharities(Array.isArray(data) ? data.map(normalizeCharity) : []);
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
    setForm((previous) => ({ ...previous, [name]: value }));

    if (name === "image") {
      setSelectedFile(null);
      setSelectedImageName("");
      setImageClearedExplicitly(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      syncPreview(value);
    }
  };

  const clearSelectedImage = () => {
    clearObjectPreview();
    setSelectedFile(null);
    setSelectedImageName("");
    setImagePreview("");
    setImageClearedExplicitly(true);
    setForm((previous) => ({ ...previous, image: "" }));

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
      message.error("Image size should be under 5 MB.");
      event.target.value = "";
      return;
    }

    clearObjectPreview();
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;

    setSelectedFile(file);
    setSelectedImageName(file.name);
    setImagePreview(previewUrl);
    setImageClearedExplicitly(false);
    setForm((previous) => ({ ...previous, image: "" }));
    message.success("Image ready for upload.");
  };

  const resetForm = useCallback(() => {
    clearObjectPreview();
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSelectedFile(null);
    setSelectedImageName("");
    setImagePreview("");
    setInitialImageValue("");
    setImageClearedExplicitly(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [clearObjectPreview]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = safeString(form.name).trim();
    const description = safeString(form.description).trim();
    const image = safeString(form.image).trim();

    if (!name) {
      message.error("Name is required.");
      return;
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("description", description);

    if (selectedFile) {
      payload.append("imageFile", selectedFile);
    } else if (imageClearedExplicitly) {
      payload.append("image", "");
    } else if (image && image !== initialImageValue) {
      payload.append("image", image);
    }

    setSaving(true);
    try {
      const targetUrl = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";
      const saved = normalizeCharity(
        await requestData(targetUrl, {
          method,
          body: payload,
        })
      );

      setCharities((previous) =>
        editingId
          ? previous.map((item) => (item._id === saved._id ? saved : item))
          : [saved, ...previous]
      );
      message.success(editingId ? "Charity updated." : "Charity created.");
      resetForm();
    } catch (err) {
      message.error(err.message || "Failed to save charity.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (charity) => {
    const normalizedCharity = normalizeCharity(charity);
    setEditingId(normalizedCharity._id);
    setForm({
      name: normalizedCharity.name,
      image:
        normalizedCharity.imageStorage === "mongodb"
          ? ""
          : normalizedCharity.image,
      description: normalizedCharity.description,
    });
    setInitialImageValue(normalizedCharity.image);
    setSelectedFile(null);
    setSelectedImageName("");
    setImageClearedExplicitly(false);
    syncPreview(normalizedCharity.image);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (charity) => {
    if (!window.confirm(`Delete "${charity.name}"?`)) {
      return;
    }

    try {
      await requestData(`${API_URL}/${charity._id}`, { method: "DELETE" });
      setCharities((previous) =>
        previous.filter((item) => item._id !== charity._id)
      );
      message.success("Charity deleted.");
    } catch (err) {
      message.error(err.message || "Failed to delete charity.");
    }
  };

  if (loadingUser) {
    return <div className="charity-admin-container">Loading...</div>;
  }

  if (!currentUser || !isAdmin) {
    return <Unauthorized />;
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
              type="text"
              value={form.image}
              onChange={handleChange}
              placeholder="https://... or /uploads/..."
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
            Upload JPG, PNG, WEBP, GIF, or SVG up to 5 MB. The backend will store uploaded files and keep the returned reference.
          </small>
          {(selectedImageName || imagePreview) && (
            <div className="charity-image-preview">
              <div className="charity-image-preview-thumb">
                <img src={imagePreview} alt={form.name || "Charity preview"} />
              </div>
              <div className="charity-image-preview-copy">
                <strong>{selectedImageName || "Current image selected"}</strong>
                <span>
                  {selectedFile
                    ? "This uploaded image will be stored by the backend when you submit."
                    : "This image reference will be processed by the backend when you submit."}
                </span>
              </div>
              <button
                type="button"
                className="button charity-secondary"
                onClick={clearSelectedImage}
                disabled={saving}
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
          <button type="submit" className="button" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Charity"
                : "Create Charity"}
          </button>
          {editingId && (
            <button
              type="button"
              className="button charity-secondary"
              onClick={resetForm}
              disabled={saving}
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
                  <img
                    src={resolveApiAssetUrl(charity.image)}
                    alt={charity.name}
                  />
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
