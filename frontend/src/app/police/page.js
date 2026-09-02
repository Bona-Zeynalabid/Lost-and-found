"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Building2,
  Package,
  Plus,
  Search,
  LogOut,
  Edit2,
  Trash2,
  Upload,
  X,
  Mail,
  User,
  Calendar,
  AlertCircle,
  Filter,
} from "lucide-react";

const categories = [
  "Phone",
  "Laptop",
  "ID",
  "Wallet",
  "Keys",
  "Bag",
  "Jewelry",
  "Clothing",
  "Pet",
  "Electronics",
  "Documents",
  "Other",
];

const initialDetails = {
  brand: "",
  model: "",
  color: "",
  imei: "",
  fullName: "",
  idNumber: "",
  idType: "",
  numberOfKeys: "",
  keyIdentifier: "",
  material: "",
  size: "",
  species: "",
  breed: "",
  petName: "",
  clothingType: "",
  clothingSize: "",
  documentType: "",
  issuer: "",
  nameOnDocument: "",
  deviceType: "",
  serialNumber: "",
  otherDescription: "",
};

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PolicePortal() {
  const [role, setRole] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [station, setStation] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Admin state
  const [stations, setStations] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [showStationModal, setShowStationModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [stationForm, setStationForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    phone: "",
    imageUrl: "",
  });

  // Station item state (step-based form)
  const [stationItems, setStationItems] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemStep, setItemStep] = useState(1);
  const [itemForm, setItemForm] = useState({
    title: "",
    description: "",
    category: "Other",
    officerName: "",
    dateFound: "",
    details: initialDetails,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Fetch admin data
  const fetchAdminData = useCallback(async () => {
    try {
      const [sRes, iRes] = await Promise.all([
        fetch(`${API}/api/police/stations`, { credentials: "include" }),
        fetch(`${API}/api/police/admin/items`, { credentials: "include" }),
      ]);
      if (sRes.ok) setStations((await sRes.json()).stations);
      if (iRes.ok) setAllItems((await iRes.json()).items);
    } catch (e) {}
  }, [API]);

  // Fetch station data
  const fetchStationData = useCallback(async () => {
    try {
      const [meRes, itemsRes] = await Promise.all([
        fetch(`${API}/api/police/station/me`, { credentials: "include" }),
        fetch(`${API}/api/police/station/items`, { credentials: "include" }),
      ]);
      if (meRes.ok) setStation((await meRes.json()).station);
      if (itemsRes.ok) setStationItems((await itemsRes.json()).items);
    } catch (e) {}
  }, [API]);

  const checkAuth = useCallback(async () => {
    try {
      const adminRes = await fetch(`${API}/api/police/admin/me`, {
        credentials: "include",
      });
      if (adminRes.ok) {
        setAdmin((await adminRes.json()).admin);
        setRole("admin");
        fetchAdminData();
        return;
      }
      const stationRes = await fetch(`${API}/api/police/station/me`, {
        credentials: "include",
      });
      if (stationRes.ok) {
        setStation((await stationRes.json()).station);
        setRole("station");
        fetchStationData();
        return;
      }
    } catch (e) {}
  }, [API, fetchAdminData, fetchStationData]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Auth handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res = await fetch(`${API}/api/police/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (res.ok) {
        setAdmin((await res.json()).admin);
        setRole("admin");
        setEmail("");
        setPassword("");
        fetchAdminData();
        return;
      }

      res = await fetch(`${API}/api/police/station/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (res.ok) {
        setStation((await res.json()).station);
        setRole("station");
        setEmail("");
        setPassword("");
        fetchStationData();
        return;
      }
      throw new Error("Invalid credentials");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (role === "admin")
      await fetch(`${API}/api/police/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    else
      await fetch(`${API}/api/police/station/logout`, {
        method: "POST",
        credentials: "include",
      });
    setRole(null);
    setAdmin(null);
    setStation(null);
    setStations([]);
    setAllItems([]);
    setStationItems([]);
  };

  // Admin station CRUD
  const openStationModal = (station = null) => {
    setEditingStation(station);
    setStationForm(
      station
        ? {
            name: station.name,
            email: station.email,
            password: "",
            address: station.address || "",
            city: station.city || "",
            latitude: station.latitude || "",
            longitude: station.longitude || "",
            phone: station.phone || "",
            imageUrl: station.imageUrl || "",
          }
        : {
            name: "",
            email: "",
            password: "",
            address: "",
            city: "",
            latitude: "",
            longitude: "",
            phone: "",
            imageUrl: "",
          },
    );
    setShowStationModal(true);
  };

  const handleStationSubmit = async (e) => {
    e.preventDefault();
    const url = editingStation
      ? `${API}/api/police/stations/${editingStation._id}`
      : `${API}/api/police/stations`;
    const method = editingStation ? "PATCH" : "POST";
    const payload = { ...stationForm };
    if (editingStation && !payload.password) delete payload.password;
    if (payload.latitude) payload.latitude = parseFloat(payload.latitude);
    if (payload.longitude) payload.longitude = parseFloat(payload.longitude);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (res.ok) {
      setShowStationModal(false);
      fetchAdminData();
    } else alert((await res.json()).error || "Failed");
  };

  const handleDeleteStation = async (id) => {
    if (confirm("Delete station and its items?")) {
      await fetch(`${API}/api/police/stations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchAdminData();
    }
  };

  // Station item step-based form helpers
  const resetItemForm = () => {
    setItemForm({
      title: "",
      description: "",
      category: "Other",
      officerName: "",
      dateFound: "",
      details: initialDetails,
    });
    setItemStep(1);
    setImageFiles([]);
    setImagePreviews([]);
    setEditingItem(null);
  };

  const openItemForm = (item = null) => {
    setEditingItem(item);
    setItemForm(
      item
        ? {
            title: item.title,
            description: item.description || "",
            category: item.category,
            officerName: item.officerName,
            dateFound: item.dateFound?.slice(0, 10),
            details: item.details || initialDetails,
          }
        : {
            title: "",
            description: "",
            category: "Other",
            officerName: "",
            dateFound: "",
            details: initialDetails,
          },
    );
    setItemStep(1);
    setImageFiles([]);
    setImagePreviews([]);
    setShowItemForm(true);
  };

  const handleCategoryChange = (cat) => {
    setItemForm((prev) => ({
      ...prev,
      category: cat,
      details: initialDetails,
    }));
  };

  const handleDetailChange = (field, value) => {
    setItemForm((prev) => ({
      ...prev,
      details: { ...prev.details, [field]: value },
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [
        ...prev,
        ...newFiles.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadStationImages = async () => {
    if (imageFiles.length === 0) return [];
    setUploading(true);
    const formData = new FormData();
    imageFiles.forEach((f) => formData.append("files", f));
    try {
      const res = await fetch(`${API}/api/police/station/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      const data = await res.json();
      return data.images;
    } catch (err) {
      alert(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    const images = await uploadStationImages();
    if (images === null) return;

    const url = editingItem
      ? `${API}/api/police/station/items/${editingItem._id}`
      : `${API}/api/police/station/items`;
    const method = editingItem ? "PATCH" : "POST";
    const payload = { ...itemForm, details: itemForm.details, images };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (res.ok) {
      setShowItemForm(false);
      resetItemForm();
      fetchStationData();
    } else alert((await res.json()).error || "Failed");
  };

  const handleDeleteItem = async (id) => {
    if (confirm("Delete this item?")) {
      await fetch(`${API}/api/police/station/items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchStationData();
    }
  };

  // Complete dynamic category fields (same as user report page)
  const renderCategoryFields = () => {
    const inputClass =
      "w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)] transition-colors";
    const labelClass =
      "block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1";
    const { category, details } = itemForm;

    switch (category) {
      case "Phone":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Apple, Samsung, etc."
                value={details.brand}
                onChange={(e) => handleDetailChange("brand", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="iPhone 13, Galaxy S22, etc."
                value={details.model}
                onChange={(e) => handleDetailChange("model", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <input
                type="text"
                placeholder="Blue, Black, etc."
                value={details.color}
                onChange={(e) => handleDetailChange("color", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>IMEI</label>
              <input
                type="text"
                placeholder="15-digit IMEI number"
                value={details.imei}
                onChange={(e) => handleDetailChange("imei", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        );

      case "Laptop":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Dell, Apple, HP, etc."
                value={details.brand}
                onChange={(e) => handleDetailChange("brand", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="XPS 15, MacBook Pro, etc."
                value={details.model}
                onChange={(e) => handleDetailChange("model", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Serial Number</label>
              <input
                type="text"
                placeholder="Found on the bottom"
                value={details.serialNumber}
                onChange={(e) =>
                  handleDetailChange("serialNumber", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <input
                type="text"
                placeholder="Silver, Space Gray"
                value={details.color}
                onChange={(e) => handleDetailChange("color", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        );

      case "ID":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="As it appears on the document"
                value={details.fullName}
                onChange={(e) => handleDetailChange("fullName", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                ID Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="The identification number"
                value={details.idNumber}
                onChange={(e) => handleDetailChange("idNumber", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>ID Type</label>
              <select
                value={details.idType}
                onChange={(e) => handleDetailChange("idType", e.target.value)}
                className={inputClass}
              >
                <option value="">Select type</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID</option>
                <option value="student_id">Student ID</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case "Keys":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Number of Keys <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="How many keys?"
                value={details.numberOfKeys}
                onChange={(e) =>
                  handleDetailChange("numberOfKeys", e.target.value)
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Distinguishing Feature</label>
              <input
                type="text"
                placeholder="Keychain, color, unique charm"
                value={details.keyIdentifier}
                onChange={(e) =>
                  handleDetailChange("keyIdentifier", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>
        );

      case "Wallet":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Brown, Black, etc."
                value={details.color}
                onChange={(e) => handleDetailChange("color", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <input
                type="text"
                placeholder="If known"
                value={details.brand}
                onChange={(e) => handleDetailChange("brand", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Material</label>
              <input
                type="text"
                placeholder="Leather, fabric"
                value={details.material}
                onChange={(e) => handleDetailChange("material", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        );

      case "Bag":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Black, Blue"
                value={details.color}
                onChange={(e) => handleDetailChange("color", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <input
                type="text"
                placeholder="If known"
                value={details.brand}
                onChange={(e) => handleDetailChange("brand", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Material</label>
              <input
                type="text"
                placeholder="Canvas, leather"
                value={details.material}
                onChange={(e) => handleDetailChange("material", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Size</label>
              <input
                type="text"
                placeholder="Small, medium, backpack"
                value={details.size}
                onChange={(e) => handleDetailChange("size", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        );

      case "Jewelry":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ring, necklace, bracelet"
                value={details.deviceType}
                onChange={(e) =>
                  handleDetailChange("deviceType", e.target.value)
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                Material <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Gold, silver"
                value={details.material}
                onChange={(e) => handleDetailChange("material", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={2}
                placeholder="Engravings, stones, unique features"
                value={details.otherDescription}
                onChange={(e) =>
                  handleDetailChange("otherDescription", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>
        );

      case "Clothing":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Jacket, shoes, scarf"
                value={details.clothingType}
                onChange={(e) =>
                  handleDetailChange("clothingType", e.target.value)
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Size</label>
              <input
                type="text"
                placeholder="M, L, 42"
                value={details.clothingSize}
                onChange={(e) =>
                  handleDetailChange("clothingSize", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Blue, Red"
                value={details.color}
                onChange={(e) => handleDetailChange("color", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <input
                type="text"
                placeholder="If known"
                value={details.brand}
                onChange={(e) => handleDetailChange("brand", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        );

      case "Pet":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Species <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Dog, cat, bird"
                value={details.species}
                onChange={(e) => handleDetailChange("species", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Breed</label>
              <input
                type="text"
                placeholder="Labrador, Persian"
                value={details.breed}
                onChange={(e) => handleDetailChange("breed", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <input
                type="text"
                placeholder="Golden, black, white"
                value={details.color}
                onChange={(e) => handleDetailChange("color", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                placeholder="Pet's name"
                value={details.petName}
                onChange={(e) => handleDetailChange("petName", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        );

      case "Electronics":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Device Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Camera, tablet, headphones"
                value={details.deviceType}
                onChange={(e) =>
                  handleDetailChange("deviceType", e.target.value)
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Sony, Apple, Bose"
                value={details.brand}
                onChange={(e) => handleDetailChange("brand", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Model</label>
              <input
                type="text"
                placeholder="Model name or number"
                value={details.model}
                onChange={(e) => handleDetailChange("model", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Serial Number</label>
              <input
                type="text"
                placeholder="If available"
                value={details.serialNumber}
                onChange={(e) =>
                  handleDetailChange("serialNumber", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>
        );

      case "Documents":
        return (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>
                Document Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Passport, certificate, contract"
                value={details.documentType}
                onChange={(e) =>
                  handleDetailChange("documentType", e.target.value)
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                Name on Document <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Full name as it appears"
                value={details.nameOnDocument}
                onChange={(e) =>
                  handleDetailChange("nameOnDocument", e.target.value)
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Issuer</label>
              <input
                type="text"
                placeholder="Government, university, bank"
                value={details.issuer}
                onChange={(e) => handleDetailChange("issuer", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        );

      case "Other":
        return (
          <div>
            <label className={labelClass}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Brand, color, size, unique markings"
              value={details.otherDescription}
              onChange={(e) =>
                handleDetailChange("otherDescription", e.target.value)
              }
              className={inputClass}
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  const isItemStepValid = () => {
    switch (itemStep) {
      case 1:
        return itemForm.title.trim().length > 0 && itemForm.category.length > 0;
      case 2:
        return itemForm.officerName.trim().length > 0;
      case 3:
        return itemForm.dateFound.trim().length > 0;
      default:
        return true;
    }
  };

  const filteredItems = (role === "admin" ? allItems : stationItems).filter(
    (item) =>
      (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.officerName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "All" || item.category === categoryFilter),
  );

  // Login screen
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-main)]">
        <div className="w-full max-w-sm">
          {/* Back to Home */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="mb-4 flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>

          <div className="glass-panel p-6 w-full space-y-4">
            <div className="text-center">
              <Shield className="h-10 w-10 mx-auto text-[var(--accent-green)]" />
              <h2 className="text-xl font-serif-heading mt-2 text-[var(--text-primary)]">
                Police Portal
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Admin or Station login
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-9 p-2 border border-[var(--border-color)] rounded bg-[var(--bg-main)] text-[var(--text-primary)]"
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-9 p-2 border border-[var(--border-color)] rounded bg-[var(--bg-main)] text-[var(--text-primary)]"
                  required
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                disabled={loading}
                className="w-full py-2 bg-[var(--accent-green)] text-white rounded"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="text-center mt-4">
              <a
                href="https://t.me/Sabanbon_pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
              >
                Don't have an account or forgot credentials? Contact admin
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-main)]/80 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {role === "station" && station?.imageUrl && (
              <img
                src={station.imageUrl}
                alt="logo"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-lg font-bold">
                {role === "admin" ? "Police Admin" : station?.name}
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                {role === "admin"
                  ? admin?.email
                  : `${station?.city || ""}${station?.phone ? ` • ${station.phone}` : ""}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs border border-[var(--border-color)] px-3 py-1.5 rounded hover:bg-[var(--border-color)]"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Admin section */}
        {role === "admin" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Stations ({stations.length})
              </h2>
              <button
                onClick={() => openStationModal()}
                className="flex items-center gap-1.5 px-3 py-2 bg-[var(--accent-green)] text-white rounded"
              >
                <Plus size={16} /> Add Station
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map((s) => (
                <div key={s._id} className="glass-panel p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    {s.imageUrl ? (
                      <img
                        src={s.imageUrl}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-10 h-10 text-[var(--text-secondary)]" />
                    )}
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {s.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[var(--border-color)]">
                    <button
                      onClick={() => openStationModal(s)}
                      className="text-xs text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStation(s._id)}
                      className="text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Station items header */}
        {role === "station" && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Found Items ({stationItems.length})
            </h2>
            <button
              onClick={() => openItemForm()}
              className="flex items-center gap-1.5 px-3 py-2 bg-[var(--accent-green)] text-white rounded"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 p-2 border border-[var(--border-color)] rounded bg-[var(--bg-main)] text-[var(--text-primary)]"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-main)] text-[var(--text-primary)]"
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Items list */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div key={item._id} className="glass-panel p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-[var(--text-secondary)]" />
                  )}
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {item.category} • {item.officerName}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {new Date(item.dateFound).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {role === "station" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openItemForm(item)}
                      className="text-xs text-blue-600"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="text-xs text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Station modal (admin) */}
      {showStationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowStationModal(false)}
        >
          <div
            className="glass-panel p-6 w-full max-w-md space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingStation ? "Edit Station" : "Add Station"}
              </h3>
              <button onClick={() => setShowStationModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleStationSubmit} className="space-y-3">
              <input
                className="w-full p-2 border border-[var(--border-color)] rounded"
                placeholder="Name"
                value={stationForm.name}
                onChange={(e) =>
                  setStationForm({ ...stationForm, name: e.target.value })
                }
                required
              />
              <input
                className="w-full p-2 border border-[var(--border-color)] rounded"
                placeholder="Email"
                type="email"
                value={stationForm.email}
                onChange={(e) =>
                  setStationForm({ ...stationForm, email: e.target.value })
                }
                required
              />
              <input
                className="w-full p-2 border border-[var(--border-color)] rounded"
                placeholder="Password"
                type="password"
                value={stationForm.password}
                onChange={(e) =>
                  setStationForm({ ...stationForm, password: e.target.value })
                }
                required={!editingStation}
              />
              <input
                className="w-full p-2 border border-[var(--border-color)] rounded"
                placeholder="Address"
                value={stationForm.address}
                onChange={(e) =>
                  setStationForm({ ...stationForm, address: e.target.value })
                }
              />
              <input
                className="w-full p-2 border border-[var(--border-color)] rounded"
                placeholder="City"
                value={stationForm.city}
                onChange={(e) =>
                  setStationForm({ ...stationForm, city: e.target.value })
                }
              />
              <input
                className="w-full p-2 border border-[var(--border-color)] rounded"
                placeholder="Latitude"
                value={stationForm.latitude}
                onChange={(e) =>
                  setStationForm({ ...stationForm, latitude: e.target.value })
                }
              />
              <input
                className="w-full p-2 border border-[var(--border-color)] rounded"
                placeholder="Longitude"
                value={stationForm.longitude}
                onChange={(e) =>
                  setStationForm({ ...stationForm, longitude: e.target.value })
                }
              />
              <input
                className="w-full p-2 border border-[var(--border-color)] rounded"
                placeholder="Phone"
                value={stationForm.phone}
                onChange={(e) =>
                  setStationForm({ ...stationForm, phone: e.target.value })
                }
              />
              <input
                className="w-full p-2 border border-[var(--border-color)] rounded"
                placeholder="Logo URL"
                value={stationForm.imageUrl}
                onChange={(e) =>
                  setStationForm({ ...stationForm, imageUrl: e.target.value })
                }
              />
              <button className="w-full py-2 bg-[var(--accent-green)] text-white rounded">
                {editingStation ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Item form modal with steps */}
      {showItemForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
          onClick={() => setShowItemForm(false)}
        >
          <div
            className="glass-panel p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
              <h3 className="text-lg font-semibold">
                {editingItem ? "Edit Found Item" : "New Found Item"}
              </h3>
              <button onClick={() => setShowItemForm(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[var(--border-color)] h-1 rounded-full">
              <div
                className="bg-[var(--accent-gold)] h-full rounded-full transition-all"
                style={{ width: `${(itemStep / 3) * 100}%` }}
              />
            </div>

            <form onSubmit={handleItemSubmit} className="space-y-4">
              {itemStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={itemForm.title}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, title: e.target.value })
                      }
                      className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)] rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Category *
                    </label>
                    <select
                      value={itemForm.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)] rounded"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {itemStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Officer Name *
                    </label>
                    <input
                      type="text"
                      value={itemForm.officerName}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          officerName: e.target.value,
                        })
                      }
                      className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)] rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Date Found *
                    </label>
                    <input
                      type="date"
                      value={itemForm.dateFound}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, dateFound: e.target.value })
                      }
                      className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)] rounded dark:[color-scheme:dark]"
                      required
                    />
                  </div>
                </div>
              )}

              {itemStep === 3 && (
                <div className="space-y-4">
                  <div className="p-3 border border-[var(--border-color)] rounded">
                    <span className="text-xs uppercase tracking-wider text-[var(--accent-gold)] font-semibold">
                      {itemForm.category} Details
                    </span>
                    {renderCategoryFields()}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={itemForm.description}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)] rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                      Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-xs text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:bg-[var(--accent-green)] file:text-white"
                    />
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {imagePreviews.map((preview, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square overflow-hidden border border-[var(--border-color)] rounded"
                          >
                            <img
                              src={preview}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setItemStep((prev) => Math.max(1, prev - 1))}
                  disabled={itemStep === 1}
                  className="px-4 py-2 border border-[var(--border-color)] text-xs uppercase tracking-wider rounded"
                >
                  Back
                </button>
                {itemStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (isItemStepValid()) setItemStep((prev) => prev + 1);
                      else alert("Please fill required fields");
                    }}
                    className="px-4 py-2 bg-[var(--accent-green)] text-white text-xs uppercase tracking-wider rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-[var(--accent-gold)] text-white text-xs uppercase tracking-wider rounded"
                  >
                    {uploading
                      ? "Uploading..."
                      : editingItem
                        ? "Update"
                        : "Submit"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
