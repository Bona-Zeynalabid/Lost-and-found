"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useStore from "@/lib/store";

const categories = [
  "Phone", "Laptop", "ID", "Wallet", "Keys", "Bag",
  "Jewelry", "Clothing", "Pet", "Electronics", "Documents", "Other",
];

const initialDetails = {
  brand: "", model: "", color: "", imei: "",
  fullName: "", idNumber: "", idType: "",
  numberOfKeys: "", keyIdentifier: "",
  material: "", size: "",
  species: "", breed: "", petName: "",
  clothingType: "", clothingSize: "",
  documentType: "", issuer: "", nameOnDocument: "",
  deviceType: "", serialNumber: "",
  otherDescription: "",
};

export default function ReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "found" ? "found" : "lost";
  const user = useStore((s) => s.user);

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState(initialDetails);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [dateOccurred, setDateOccurred] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [reward, setReward] = useState("");
  const [tags, setTags] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 5;

  useEffect(() => {
    if (type && category) {
      const typeLabel = type === "lost" ? "Lost" : "Found";
      setTitle(`${typeLabel} ${category}`);
    }
  }, [type, category]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setDetails(initialDetails);
  };

  const handleDetailChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    setUploading(true);
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("http://localhost:5000/api/upload/multiple", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      const data = await res.json();
      setUploading(false);
      return data.images;
    } catch (err) {
      setError("Image upload failed: " + err.message);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      setError("You must be logged in to file a report.");
      return;
    }
    setError("");

    const images = await uploadImages();
    if (images === null) return;

    const payload = {
      type,
      title,
      description,
      category,
      details,
      location: { address, city },
      dateOccurred,
      contact: { phone: contactPhone, email: contactEmail },
      reward: type === "lost" && reward ? Number(reward) : 0,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      images,
    };

    try {
      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Required fields for matching
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return type.length > 0 && category.length > 0;
      case 2:
        return title.trim().length > 0 && isCategoryDetailsValid();
      case 3:
        return address.trim().length > 0 && city.trim().length > 0 && dateOccurred.trim().length > 0;
      case 4:
        return description.trim().length > 0 && contactPhone.trim().length > 0;
      default:
        return true;
    }
  };

  // Validate category-specific required fields
  const isCategoryDetailsValid = () => {
    if (!category) return true;
    switch (category) {
      case "Phone":
        return details.brand.trim().length > 0 && details.model.trim().length > 0;
      case "Laptop":
        return details.brand.trim().length > 0 && details.model.trim().length > 0;
      case "ID":
        return details.fullName.trim().length > 0 && details.idNumber.trim().length > 0;
      case "Keys":
        return details.numberOfKeys.trim().length > 0;
      case "Wallet":
        return details.color.trim().length > 0;
      case "Bag":
        return details.color.trim().length > 0;
      case "Jewelry":
        return details.deviceType.trim().length > 0 && details.material.trim().length > 0;
      case "Clothing":
        return details.clothingType.trim().length > 0 && details.color.trim().length > 0;
      case "Pet":
        return details.species.trim().length > 0;
      case "Electronics":
        return details.deviceType.trim().length > 0 && details.brand.trim().length > 0;
      case "Documents":
        return details.documentType.trim().length > 0 && details.nameOnDocument.trim().length > 0;
      case "Other":
        return details.otherDescription.trim().length > 0;
      default:
        return true;
    }
  };

  const getMissingFieldsMessage = () => {
    const missing = [];
    if (!title.trim()) missing.push("Title");
    if (!address.trim()) missing.push("Address");
    if (!city.trim()) missing.push("City");
    if (!dateOccurred.trim()) missing.push("Date");
    if (!description.trim()) missing.push("Description");
    if (!contactPhone.trim()) missing.push("Phone");

    if (category) {
      switch (category) {
        case "Phone":
          if (!details.brand.trim()) missing.push("Phone Brand");
          if (!details.model.trim()) missing.push("Phone Model");
          break;
        case "Laptop":
          if (!details.brand.trim()) missing.push("Laptop Brand");
          if (!details.model.trim()) missing.push("Laptop Model");
          break;
        case "ID":
          if (!details.fullName.trim()) missing.push("Full Name on ID");
          if (!details.idNumber.trim()) missing.push("ID Number");
          break;
        case "Keys":
          if (!details.numberOfKeys.trim()) missing.push("Number of Keys");
          break;
        case "Wallet":
          if (!details.color.trim()) missing.push("Wallet Color");
          break;
        case "Bag":
          if (!details.color.trim()) missing.push("Bag Color");
          break;
        case "Jewelry":
          if (!details.deviceType.trim()) missing.push("Jewelry Type");
          if (!details.material.trim()) missing.push("Material");
          break;
        case "Clothing":
          if (!details.clothingType.trim()) missing.push("Clothing Type");
          if (!details.color.trim()) missing.push("Color");
          break;
        case "Pet":
          if (!details.species.trim()) missing.push("Species");
          break;
        case "Electronics":
          if (!details.deviceType.trim()) missing.push("Device Type");
          if (!details.brand.trim()) missing.push("Brand");
          break;
        case "Documents":
          if (!details.documentType.trim()) missing.push("Document Type");
          if (!details.nameOnDocument.trim()) missing.push("Name on Document");
          break;
        case "Other":
          if (!details.otherDescription.trim()) missing.push("Description");
          break;
      }
    }
    return missing.length > 0 ? `Missing: ${missing.join(", ")}` : "";
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      const missingMsg = getMissingFieldsMessage();
      setError(missingMsg || "Please complete all required fields before continuing.");
      return;
    }
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCancel = () => router.push("/dashboard");

  const resetForm = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setType("lost");
    setCategory("");
    setTitle("");
    setDescription("");
    setDetails(initialDetails);
    setAddress("");
    setCity("");
    setDateOccurred("");
    setContactPhone("");
    setContactEmail("");
    setReward("");
    setTags("");
    setImageFiles([]);
    setImagePreviews([]);
    setError("");
  };

  const inputClass = "w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)] transition-colors";
  const labelClass = "block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1";

  const renderCategoryFields = () => {
    switch (category) {
      case "Phone":
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Brand <span className="text-red-500">*</span></label><input type="text" placeholder="Apple, Samsung, etc." value={details.brand} onChange={(e) => handleDetailChange("brand", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Model <span className="text-red-500">*</span></label><input type="text" placeholder="iPhone 13, Galaxy S22, etc." value={details.model} onChange={(e) => handleDetailChange("model", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Color</label><input type="text" placeholder="Blue, Black, etc." value={details.color} onChange={(e) => handleDetailChange("color", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>IMEI</label><input type="text" placeholder="15-digit IMEI number" value={details.imei} onChange={(e) => handleDetailChange("imei", e.target.value)} className={inputClass} /></div>
          </div>
        );
      case "Laptop":
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Brand <span className="text-red-500">*</span></label><input type="text" placeholder="Dell, Apple, HP, etc." value={details.brand} onChange={(e) => handleDetailChange("brand", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Model <span className="text-red-500">*</span></label><input type="text" placeholder="XPS 15, MacBook Pro, etc." value={details.model} onChange={(e) => handleDetailChange("model", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Serial Number</label><input type="text" placeholder="Found on the bottom" value={details.serialNumber} onChange={(e) => handleDetailChange("serialNumber", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Color</label><input type="text" placeholder="Silver, Space Gray" value={details.color} onChange={(e) => handleDetailChange("color", e.target.value)} className={inputClass} /></div>
          </div>
        );
      case "ID":
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Full Name <span className="text-red-500">*</span></label><input type="text" placeholder="As it appears on the document" value={details.fullName} onChange={(e) => handleDetailChange("fullName", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>ID Number <span className="text-red-500">*</span></label><input type="text" placeholder="The identification number" value={details.idNumber} onChange={(e) => handleDetailChange("idNumber", e.target.value)} className={inputClass} required /></div>
            <div>
              <label className={labelClass}>ID Type</label>
              <select value={details.idType} onChange={(e) => handleDetailChange("idType", e.target.value)} className={inputClass}>
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
            <div><label className={labelClass}>Number of Keys <span className="text-red-500">*</span></label><input type="number" placeholder="How many keys?" value={details.numberOfKeys} onChange={(e) => handleDetailChange("numberOfKeys", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Distinguishing Feature</label><input type="text" placeholder="Keychain, color, unique charm" value={details.keyIdentifier} onChange={(e) => handleDetailChange("keyIdentifier", e.target.value)} className={inputClass} /></div>
          </div>
        );
      case "Wallet":
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Color <span className="text-red-500">*</span></label><input type="text" placeholder="Brown, Black, etc." value={details.color} onChange={(e) => handleDetailChange("color", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Brand</label><input type="text" placeholder="If known" value={details.brand} onChange={(e) => handleDetailChange("brand", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Material</label><input type="text" placeholder="Leather, fabric" value={details.material} onChange={(e) => handleDetailChange("material", e.target.value)} className={inputClass} /></div>
          </div>
        );
      case "Bag":
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Color <span className="text-red-500">*</span></label><input type="text" placeholder="Black, Blue" value={details.color} onChange={(e) => handleDetailChange("color", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Brand</label><input type="text" placeholder="If known" value={details.brand} onChange={(e) => handleDetailChange("brand", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Material</label><input type="text" placeholder="Canvas, leather" value={details.material} onChange={(e) => handleDetailChange("material", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Size</label><input type="text" placeholder="Small, medium, backpack" value={details.size} onChange={(e) => handleDetailChange("size", e.target.value)} className={inputClass} /></div>
          </div>
        );
      case "Jewelry":
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Type <span className="text-red-500">*</span></label><input type="text" placeholder="Ring, necklace, bracelet" value={details.deviceType} onChange={(e) => handleDetailChange("deviceType", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Material <span className="text-red-500">*</span></label><input type="text" placeholder="Gold, silver" value={details.material} onChange={(e) => handleDetailChange("material", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Description</label><textarea rows={2} placeholder="Engravings, stones, unique features" value={details.otherDescription} onChange={(e) => handleDetailChange("otherDescription", e.target.value)} className={inputClass} /></div>
          </div>
        );
      case "Clothing":
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Type <span className="text-red-500">*</span></label><input type="text" placeholder="Jacket, shoes, scarf" value={details.clothingType} onChange={(e) => handleDetailChange("clothingType", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Size</label><input type="text" placeholder="M, L, 42" value={details.clothingSize} onChange={(e) => handleDetailChange("clothingSize", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Color <span className="text-red-500">*</span></label><input type="text" placeholder="Blue, Red" value={details.color} onChange={(e) => handleDetailChange("color", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Brand</label><input type="text" placeholder="If known" value={details.brand} onChange={(e) => handleDetailChange("brand", e.target.value)} className={inputClass} /></div>
          </div>
        );
      case "Pet":
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Species <span className="text-red-500">*</span></label><input type="text" placeholder="Dog, cat, bird" value={details.species} onChange={(e) => handleDetailChange("species", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Breed</label><input type="text" placeholder="Labrador, Persian" value={details.breed} onChange={(e) => handleDetailChange("breed", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Color</label><input type="text" placeholder="Golden, black, white" value={details.color} onChange={(e) => handleDetailChange("color", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Name</label><input type="text" placeholder="Pet's name" value={details.petName} onChange={(e) => handleDetailChange("petName", e.target.value)} className={inputClass} /></div>
          </div>
        );
      case "Electronics":
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Device Type <span className="text-red-500">*</span></label><input type="text" placeholder="Camera, tablet, headphones" value={details.deviceType} onChange={(e) => handleDetailChange("deviceType", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Brand <span className="text-red-500">*</span></label><input type="text" placeholder="Sony, Apple, Bose" value={details.brand} onChange={(e) => handleDetailChange("brand", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Model</label><input type="text" placeholder="Model name or number" value={details.model} onChange={(e) => handleDetailChange("model", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Serial Number</label><input type="text" placeholder="If available" value={details.serialNumber} onChange={(e) => handleDetailChange("serialNumber", e.target.value)} className={inputClass} /></div>
          </div>
        );
      case "Documents":
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Document Type <span className="text-red-500">*</span></label><input type="text" placeholder="Passport, certificate, contract" value={details.documentType} onChange={(e) => handleDetailChange("documentType", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Name on Document <span className="text-red-500">*</span></label><input type="text" placeholder="Full name as it appears" value={details.nameOnDocument} onChange={(e) => handleDetailChange("nameOnDocument", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Issuer</label><input type="text" placeholder="Government, university, bank" value={details.issuer} onChange={(e) => handleDetailChange("issuer", e.target.value)} className={inputClass} /></div>
          </div>
        );
      case "Other":
        return (
          <div>
            <label className={labelClass}>Description <span className="text-red-500">*</span></label>
            <textarea rows={3} placeholder="Brand, color, size, unique markings" value={details.otherDescription} onChange={(e) => handleDetailChange("otherDescription", e.target.value)} className={inputClass} required />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 sm:py-6">
      {/* Header */}
      <section className="border-b border-[var(--border-color)] pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">Report an Item</h2>
          <p className="text-xs text-[var(--text-secondary)] tracking-wide">All fields marked * are required for matching.</p>
        </div>
        {!submitted && (
          <span className="text-[10px] uppercase tracking-widest font-semibold border border-[var(--border-color)] px-2.5 py-1 text-[var(--accent-gold)]">
            {currentStep} / {totalSteps}
          </span>
        )}
      </section>

      {submitted ? (
        <div className="glass-panel p-8 border-l-4 border-[var(--accent-gold)] text-xs space-y-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--accent-green)]/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[var(--accent-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-serif-heading text-xl font-semibold">Report Submitted</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed">Your report has been filed. We'll notify you if a match is found.</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button onClick={resetForm} className="px-4 py-2 bg-[var(--accent-green)] text-white uppercase text-[10px] tracking-widest font-semibold hover:opacity-90 transition-opacity rounded-lg">File Another</button>
            <button onClick={() => router.push("/dashboard")} className="px-4 py-2 border border-[var(--border-color)] uppercase text-[10px] tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg">Dashboard</button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-6 sm:p-8 space-y-6 rounded-xs border border-[var(--border-color)]">
          {/* Progress Bar */}
          <div className="w-full bg-[var(--border-color)] h-1 rounded-full overflow-hidden">
            <div className="bg-[var(--accent-gold)] h-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>

          {/* Step 1: Type & Category */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Type <span className="text-red-500">*</span></label>
                <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                  <option value="lost">I lost something</option>
                  <option value="found">I found something</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Category <span className="text-red-500">*</span></label>
                <select value={category} onChange={(e) => handleCategoryChange(e.target.value)} className={inputClass}>
                  <option value="">Select category</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Item Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
              </div>
              {category ? (
                <div className="p-4 border border-[var(--border-color)] rounded-xs space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--accent-gold)] font-semibold">{category} Details</span>
                  {renderCategoryFields()}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-secondary)] text-center py-4">Select a category first.</p>
              )}
            </div>
          )}

          {/* Step 3: Location & Date */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div><label className={labelClass}>Address <span className="text-red-500">*</span></label><input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Where did this happen?" className={inputClass} /></div>
              <div><label className={labelClass}>City <span className="text-red-500">*</span></label><input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputClass} /></div>
              <div><label className={labelClass}>Date <span className="text-red-500">*</span></label><input type="date" required value={dateOccurred} onChange={(e) => setDateOccurred(e.target.value)} className={inputClass} /></div>
            </div>
          )}

          {/* Step 4: Description & Contact */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div><label className={labelClass}>Description <span className="text-red-500">*</span></label><textarea rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details that help identify the item" className={inputClass} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Phone <span className="text-red-500">*</span></label><input type="text" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="For contact" className={inputClass} /></div>
                <div><label className={labelClass}>Email</label><input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Optional" className={inputClass} /></div>
              </div>
            </div>
          )}

          {/* Step 5: Extras & Submit */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className={`grid ${type === "lost" ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                {type === "lost" && (
                  <div><label className={labelClass}>Reward</label><input type="number" min="0" value={reward} onChange={(e) => setReward(e.target.value)} placeholder="Optional" className={inputClass} /></div>
                )}
                <div><label className={labelClass}>Tags</label><input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. blue, leather" className={inputClass} /></div>
              </div>
              <div>
                <label className={labelClass}>Images</label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full text-xs text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-xs file:border-0 file:text-xs file:bg-[var(--accent-green)] file:text-white hover:file:opacity-90 transition-opacity" />
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xs overflow-hidden border border-[var(--border-color)]">
                        <img src={preview} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-red-700">✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {uploading && <p className="text-xs text-[var(--accent-gold)] mt-2">Uploading...</p>}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-600 border border-red-200 bg-red-50 p-2.5 rounded-xs">{error}</p>}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <button type="button" onClick={handleCancel} className="px-3 py-2 text-[10px] uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors rounded-xs">Cancel</button>
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <button type="button" onClick={handleBack} className="px-3 py-2 border border-[var(--border-color)] text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-xs">Back</button>
              )}
              {currentStep < totalSteps ? (
                <button type="button" onClick={handleNext} className="px-5 py-2 bg-[var(--accent-green)] text-white text-[10px] uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity rounded-xs">Next</button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={uploading} className="px-5 py-2 bg-[var(--accent-gold)] text-white text-[10px] uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 rounded-xs">
                  {uploading ? "Uploading..." : "Submit Report"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}