export default function ItemCard({ item }) {
  // Extract image safely
  const imageUrl = item.images?.[0]?.url || null;

  // Format location
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

  // Format date
  const formattedDate = item.dateOccurred
    ? new Date(item.dateOccurred).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <article className="border border-[var(--border-color)] p-4 bg-[var(--card-bg)] hover:border-[var(--accent-gold)] transition-colors rounded-md">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Optional Image Thumbnail */}
        {imageUrl && (
          <div className="w-full sm:w-28 h-28 shrink-0 bg-[var(--border-color)] overflow-hidden">
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        )}

        {/* Content Details */}
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-serif-heading text-base font-medium">
                {item.title}
              </h3>
              <span className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
                {item.type}
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mb-2">
              {locationText} &bull; {formattedDate}
            </p>

            <p className="text-xs text-[var(--text-primary)] leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest pt-2 border-t border-[var(--border-color)]">
            Reference: {item._id}
          </div>
        </div>
      </div>
    </article>
  );
}