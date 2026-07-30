export default function NotificationsPage() {
  const notifications = [
    {
      id: "notif-01",
      date: "2026-07-29",
      message: "Potential match identified for Case #case-001 (Vintage Leather Briefcase).",
      type: "Match Alert",
    },
    {
      id: "notif-02",
      date: "2026-07-27",
      message: "Official verification requested for recovered Signet Ring.",
      type: "Verification Request",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Official Circulars & Alerts
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          System updates regarding matched property and status changes.
        </p>
      </section>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="glass-panel p-4 rounded-xs border-l-2 border-[var(--accent-gold)]">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              <span>{n.type}</span>
              <span>{n.date}</span>
            </div>
            <p className="text-xs leading-relaxed">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}