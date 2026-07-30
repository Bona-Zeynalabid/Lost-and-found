export default function CommunityPage() {
  const posts = [
    {
      id: "post-1",
      author: "Member #402",
      time: "2 hours ago",
      text: "Notice: Heavy rain expected near the Quadrangle. Take care with items left on benches.",
    },
    {
      id: "post-2",
      author: "Registry Office",
      time: "1 day ago",
      text: "Unclaimed items from June will be archived to the central depot next week.",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Civic Forum & Notices
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          Community bulletin board for general inquiries and notices.
        </p>
      </section>

      {/* New Post Input */}
      <div className="glass-panel p-4 rounded-xs space-y-3">
        <textarea
          rows={3}
          placeholder="Post a general community inquiry..."
          className="w-full bg-transparent border border-[var(--border-color)] p-2 text-xs focus:outline-none focus:border-[var(--accent-gold)]"
        />
        <button className="px-4 py-2 bg-[var(--accent-green)] text-white text-[10px] uppercase tracking-widest">
          Publish Entry
        </button>
      </div>

      {/* Feed Stream */}
      <div className="space-y-3">
        {posts.map((p) => (
          <article key={p.id} className="glass-panel p-4 rounded-xs border-b border-[var(--border-color)]">
            <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
              <span className="font-semibold text-[var(--text-primary)]">{p.author}</span>
              <span>{p.time}</span>
            </div>
            <p className="text-xs leading-relaxed">{p.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}