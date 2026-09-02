export default function ItemCard({ item, onClick, horizontal = false }) {
  const imageUrl = item.images?.[0]?.url || null;
  const hasReward = item.reward && item.reward > 0;

  let locationText = "";
  if (item.location) {
    locationText = item.location.address || item.location.city || "";
  }

  const formattedDate = item.dateOccurred || item.dateFound
    ? new Date(item.dateOccurred || item.dateFound).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";

  return (
    <div
      onClick={onClick}
      className={`bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
        horizontal ? "flex flex-row" : "flex flex-col"
      }`}
    >
      {/* Image */}
      <div className={`${horizontal ? "w-36 h-36 flex-shrink-0" : "w-full h-40"} bg-[var(--border-color)] relative`}>
        {imageUrl ? (
          <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)] text-xs">No Image</div>
        )}
        {/* Type badge */}
        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          item.isPolice ? "bg-blue-500 text-white" : item.type === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}>
          {item.isPolice ? "Police" : item.type}
        </span>
      </div>

      {/* Content */}
      <div className={`${horizontal ? "flex-1" : ""} p-3 flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] line-clamp-1">{item.title}</h3>
            {hasReward && <span className="text-xs font-bold text-[var(--accent-gold)]">${item.reward}</span>}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.category}</p>
          {locationText && <p className="text-xs text-[var(--text-secondary)] mt-1 truncate">{locationText}</p>}
          {item.isPolice && item.station?.name && (
            <p className="text-xs text-blue-500 mt-0.5 truncate">{item.station.name}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)]">
          <span className="text-[10px] text-[var(--text-secondary)]">{formattedDate}</span>
          {item.owner && <span className="text-[10px] text-[var(--accent-gold)] font-semibold">Yours</span>}
        </div>
      </div>
    </div>
  );
}