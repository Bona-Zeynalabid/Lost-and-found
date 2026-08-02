export default function ItemCard({ item, onClick }) {
  const imageUrl = item.images?.[0]?.url || null;

  let locationText = "Unknown location";
  if (item.location) {
    if (typeof item.location === "string") {
      locationText = item.location;
    } else if (item.location.address || item.location.city) {
      locationText = [item.location.address, item.location.city]
        .filter(Boolean)
        .join(", ");
    }
  }

  const formattedDate = item.dateOccurred
    ? new Date(item.dateOccurred).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

 
  const getCategoryPreview = () => {
    if (!item.details) return null;
    const d = item.details;
    switch (item.category) {
      case "Phone":
        return d.brand && d.model ? `${d.brand} ${d.model}` : d.brand || d.model || null;
      case "Laptop":
        return d.brand && d.model ? `${d.brand} ${d.model}` : d.brand || d.model || null;
      case "ID":
        return d.fullName ? `Name: ${d.fullName}` : d.idNumber ? `ID: ${d.idNumber}` : null;
      case "Wallet":
        return d.color || d.brand || null;
      case "Keys":
        return d.numberOfKeys ? `${d.numberOfKeys} key(s)` : null;
      case "Bag":
        return d.color || d.brand || null;
      case "Jewelry":
        return d.deviceType || d.material || null;
      case "Clothing":
        return d.clothingType || d.color || null;
      case "Pet":
        return d.species || d.breed || null;
      case "Electronics":
        return d.deviceType || d.brand || null;
      case "Documents":
        return d.documentType || d.nameOnDocument || null;
      default:
        return null;
    }
  };

  const categoryPreview = getCategoryPreview();

  const hasReward = item.reward && item.reward > 0;

  return (
    <article
      onClick={onClick}
      className={`border border-[var(--border-color)] p-4 bg-[var(--card-bg)] hover:border-[var(--accent-gold)] transition-colors rounded-md ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        
        {imageUrl && (
          <div className="w-full sm:w-28 h-28 shrink-0 bg-[var(--border-color)] overflow-hidden rounded-sm">
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        )}

        
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-serif-heading text-base font-medium truncate">
                {item.title}
              </h3>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                  item.type === "lost"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {item.type}
              </span>
            </div>

          
            <p className="text-xs text-[var(--text-secondary)] mb-1">
              {locationText} &bull; {formattedDate}
            </p>

            
            {categoryPreview && (
              <p className="text-xs text-[var(--accent-gold)] font-medium mb-1">
                {categoryPreview}
              </p>
            )}

            
            {item.description && (
              <p className="text-xs text-[var(--text-primary)] leading-relaxed line-clamp-2">
                {item.description}
              </p>
            )}

          
            {hasReward && (
              <span className="inline-block mt-1 text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                ${item.reward} Reward
              </span>
            )}
          </div>

         
          <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest pt-2 border-t border-[var(--border-color)]">
            Ref: {item._id?.toString().slice(-8) || "N/A"}
          </div>
        </div>
      </div>
    </article>
  );
}