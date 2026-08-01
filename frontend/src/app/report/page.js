"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store";

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

export default function ReportPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form Fields
  const [type, setType] = useState("lost");
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 6;

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setDetails(initialDetails);
  };

  const handleDetailChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    setUploading(true);
    const urls = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        urls.push({ url: data.url, publicId: data.public_id || "" });
      } catch (err) {
        setError("Image upload failed: " + err.message);
        setUploading(false);
        return [];
      }
    }
    setUploading(false);
    return urls;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      setError("You must be logged in to file a report.");
      return;
    }
    setError("");

    const uploadedImages = await uploadImages();
    if (uploading) return;

    const payload = {
      type,
      title,
      description,
      category,
      details,
      location: { address, city },
      dateOccurred,
      contact: { phone: contactPhone, email: contactEmail },
      reward: reward ? Number(reward) : 0,
      tags: tags
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      images: uploadedImages,
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

 
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return title.trim().length > 0;
      case 2:
        return category.trim().length > 0;
      case 3:
        return dateOccurred.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      setError("Please fill in all required fields before proceeding.");
      return;
    }
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSkip = () => {
    if (!isCurrentStepValid()) return;
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const resetForm = () => {
    setSubmitted(false);
    setCurrentStep(1);
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
    setError("");
  };

  const inputClass =
    "w-full bg-transparent border border-[var(--border-color)] p-2.5 text-xs focus:outline-none focus:border-[var(--accent-gold)] transition-colors";

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 sm:py-6">
     
      <section className="border-b border-[var(--border-color)] pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
            Intake & Reporting Form
          </h2>
          <p className="text-xs text-[var(--text-secondary)] tracking-wide">
            File an official case report for missing or recovered articles.
          </p>
        </div>
        {!submitted && (
          <span className="text-[10px] uppercase tracking-widest font-semibold border border-[var(--border-color)] px-2.5 py-1 text-[var(--accent-gold)]">
            Step {currentStep} of {totalSteps}
          </span>
        )}
      </section>

      {submitted ? (
        <div className="glass-panel p-8 border-l-4 border-[var(--accent-gold)] text-xs space-y-4">
          <h3 className="font-serif-heading text-xl font-semibold">
            Report Registered Successfully
          </h3>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Your case file has been cataloged in the institutional ledger. You will be notified of any updates or matching claims.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-[var(--accent-gold)] bg-[var(--accent-gold)] text-white uppercase text-[10px] tracking-widest font-semibold hover:opacity-90 transition-opacity"
            >
              Submit Another Entry
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 border border-[var(--border-color)] uppercase text-[10px] tracking-widest font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-6 sm:p-8 space-y-6 rounded-xs border border-[var(--border-color)]">
         
          <div className="w-full bg-[var(--border-color)] h-1 rounded-full overflow-hidden">
            <div
              className="bg-[var(--accent-gold)] h-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

         
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Article Classification <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={inputClass}
                >
                  <option value="lost">Lost Article</option>
                  <option value="found">Found Article</option>
                </select>
              </div>



              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

             
            </div>
          )}

         
          {currentStep === 2 && (
            <div className="space-y-4">
               <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Item Designation / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Leather Bound Notebook"
                  className={inputClass}
                />
              </div>

              {category ? (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--accent-gold)] mb-1 font-semibold">
                    {category} Primary Detail
                  </label>
                  {category === "Phone" || category === "Laptop" || category === "Bag" || category === "Clothing" || category === "Electronics" ? (
                    <input
                      type="text"
                      placeholder="Brand / Manufacturer"
                      value={details.brand}
                      onChange={(e) => handleDetailChange("brand", e.target.value)}
                      className={inputClass}
                    />
                  ) : category === "ID" ? (
                    <input
                      type="text"
                      placeholder="Full Name on ID"
                      value={details.fullName}
                      onChange={(e) => handleDetailChange("fullName", e.target.value)}
                      className={inputClass}
                    />
                  ) : category === "Keys" ? (
                    <input
                      type="number"
                      placeholder="Number of Keys"
                      value={details.numberOfKeys}
                      onChange={(e) => handleDetailChange("numberOfKeys", e.target.value)}
                      className={inputClass}
                    />
                  ) : category === "Pet" ? (
                    <input
                      type="text"
                      placeholder="Species (e.g. Dog, Cat)"
                      value={details.species}
                      onChange={(e) => handleDetailChange("species", e.target.value)}
                      className={inputClass}
                    />
                  ) : category === "Documents" ? (
                    <input
                      type="text"
                      placeholder="Document Type"
                      value={details.documentType}
                      onChange={(e) => handleDetailChange("documentType", e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Key Identifier / Notes"
                      value={details.otherDescription}
                      onChange={(e) => handleDetailChange("otherDescription", e.target.value)}
                      className={inputClass}
                    />
                  )}
                </div>
              ) : (
                <div className="p-4 border border-dashed border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)]">
                  Select a category above to unlock specific item fields.
                </div>
              )}
            </div>
          )}

          
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street or institutional building"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Date Occurred <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateOccurred}
                  onChange={(e) => setDateOccurred(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}

         
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  City / Region
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State any distinguishing features, marks, or specific contents..."
                  className={inputClass}
                />
              </div>
            </div>
          )}

        
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="member@domain.edu"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Reward (if any)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. blue, leather"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Supporting Documentation / Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-xs file:border-0 file:text-xs file:bg-[var(--accent-green)] file:text-white hover:file:opacity-90 transition-opacity"
                />
                {imageFiles.length > 0 && (
                  <div className="mt-2 text-[10px] text-[var(--text-secondary)] space-y-1">
                    {imageFiles.map((file, idx) => (
                      <span key={idx} className="block truncate">
                        • {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

       
          {error && (
            <p className="text-xs text-red-600 border border-red-200 bg-red-50 p-2.5 rounded-xs">
              {error}
            </p>
          )}

          
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
          
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-2 text-[10px] uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors rounded-xs"
            >
              Cancel
            </button>

           
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3 py-2 border border-[var(--border-color)] text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-xs"
                >
                  Back
                </button>
              )}

              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={!isCurrentStepValid()}
                  className="px-3 py-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:hover:text-[var(--text-secondary)] transition-colors"
                  title={!isCurrentStepValid() ? "Fill required fields to skip" : "Skip step"}
                >
                  Skip
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-[var(--accent-green)] text-white text-[10px] uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity rounded-xs shadow-xs"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="px-5 py-2 bg-[var(--accent-gold)] text-white text-[10px] uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 rounded-xs shadow-xs"
                >
                  {uploading ? "Uploading…" : "Submit Case File"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}