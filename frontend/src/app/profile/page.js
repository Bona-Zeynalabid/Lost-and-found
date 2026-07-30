export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <section className="border-b border-[var(--border-color)] pb-4">
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-normal mb-1">
          Member Profile & Settings
        </h2>
        <p className="text-xs text-[var(--text-secondary)] tracking-wide">
          Manage your credentials and ledger notifications preferences.
        </p>
      </section>

     
      <div className="glass-panel p-6 rounded-xs space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full border border-[var(--accent-gold)] flex items-center justify-center font-serif-heading font-bold text-lg">
            JD
          </div>
          <div>
            <h3 className="font-serif-heading text-lg font-semibold">Julian Desk</h3>
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
              Registry Member since 2024
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border-color)] text-center">
          <div className="glass-panel p-3">
            <p className="font-serif-heading text-xl">03</p>
            <p className="text-[10px] uppercase text-[var(--text-secondary)]">Filed Lost</p>
          </div>
          <div className="glass-panel p-3">
            <p className="font-serif-heading text-xl">01</p>
            <p className="text-[10px] uppercase text-[var(--text-secondary)]">Filed Found</p>
          </div>
          <div className="glass-panel p-3">
            <p className="font-serif-heading text-xl">02</p>
            <p className="text-[10px] uppercase text-[var(--text-secondary)]">Resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
}