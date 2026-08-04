export default function AboutPage() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden break-words">
      
      <div className="glass-panel p-4 sm:p-6 rounded-lg space-y-3 leading-relaxed">
        <h3 className="font-serif-heading text-sm sm:text-base font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
          Our Mission
        </h3>
        <p className="text-[11px] sm:text-sm text-[var(--text-secondary)]">
          FoundIt is a community-driven lost and found platform designed to reconnect people with their lost belongings through the power of technology and civic collaboration. We provide a structured, high-trust digital ledger for reporting lost and found items, enabling algorithmic matching between lost and found reports to increase recovery rates.
        </p>
        <p className="text-[11px] sm:text-sm text-[var(--text-secondary)]">
          Our platform serves universities, institutions, and communities by offering a secure, privacy-respecting environment where users can file reports, search for items, receive match notifications, and communicate with finders or owners all within a unified system.
        </p>
      </div>

      <div className="glass-panel p-4 sm:p-6 rounded-lg space-y-3 leading-relaxed">
        <h3 className="font-serif-heading text-sm sm:text-base font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
          How It Works
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
            <div>
              <p className="font-semibold text-[11px] sm:text-sm text-[var(--text-primary)]">Report an Item</p>
              <p className="text-[var(--text-secondary)] text-[11px] sm:text-xs mt-0.5">File a detailed report for a lost or found item with category-specific information, images, and contact details.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
            <div>
              <p className="font-semibold text-[11px] sm:text-sm text-[var(--text-primary)]">Automatic Matching</p>
              <p className="text-[var(--text-secondary)] text-[11px] sm:text-xs mt-0.5">Our matching algorithm cross-references lost and found reports based on category, keywords, location, and item details.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
            <div>
              <p className="font-semibold text-[11px] sm:text-sm text-[var(--text-primary)]">Get Notified</p>
              <p className="text-[var(--text-secondary)] text-[11px] sm:text-xs mt-0.5">Receive instant notifications when a potential match is found for your report, allowing you to connect and recover your item.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
            <div>
              <p className="font-semibold text-[11px] sm:text-sm text-[var(--text-primary)]">Community Forum</p>
              <p className="text-[var(--text-secondary)] text-[11px] sm:text-xs mt-0.5">Engage with the community through our discussion forum share notices, safety tips, and success stories.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 sm:p-6 rounded-lg space-y-3 leading-relaxed">
        <h3 className="font-serif-heading text-sm sm:text-base font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
          Key Features
        </h3>
        <ul className="space-y-2 text-[var(--text-secondary)] text-[11px] sm:text-xs">
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)] shrink-0">•</span>
            <span><strong className="text-[var(--text-primary)]">Category-Specific Reporting:</strong> Custom forms for phones, IDs, keys, bags, pets, electronics, and more.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)] shrink-0">•</span>
            <span><strong className="text-[var(--text-primary)]">Smart Matching Engine:</strong> Automatic cross-referencing between lost and found items.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)] shrink-0">•</span>
            <span><strong className="text-[var(--text-primary)]">Image Upload:</strong> Cloud-based image storage for visual identification.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)] shrink-0">•</span>
            <span><strong className="text-[var(--text-primary)]">Real-time Notifications:</strong> Alerts when matches are found or community interactions occur.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)] shrink-0">•</span>
            <span><strong className="text-[var(--text-primary)]">Community Forum:</strong> Discussion board with posts, replies, and likes.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)] shrink-0">•</span>
            <span><strong className="text-[var(--text-primary)]">Dark Mode Support:</strong> Full light/dark theme toggle for comfortable viewing.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)] shrink-0">•</span>
            <span><strong className="text-[var(--text-primary)]">Google Authentication:</strong> Secure sign-in with your Google account.</span>
          </li>
        </ul>
      </div>

      <div className="glass-panel p-4 sm:p-6 rounded-lg space-y-3 leading-relaxed">
        <h3 className="font-serif-heading text-sm sm:text-base font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
          Terms of Service
        </h3>
        <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] space-y-3">
          <p><strong className="text-[var(--text-primary)]">Last Updated:</strong> August 2026</p>

          <p><strong className="text-[var(--text-primary)]">1. Acceptance of Terms</strong><br />By accessing or using FoundIt, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>

          <p><strong className="text-[var(--text-primary)]">2. User Accounts</strong><br />You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information when creating an account.</p>

          <p><strong className="text-[var(--text-primary)]">3. User Conduct</strong><br />Users agree not to post false, misleading, or fraudulent reports. Harassment, spam, or any form of abuse towards other users is strictly prohibited and may result in account termination.</p>

          <p><strong className="text-[var(--text-primary)]">4. Content Ownership</strong><br />Users retain ownership of the content they post. By posting, you grant FoundIt a non-exclusive license to display and distribute your content within the platform for the purpose of item recovery.</p>

          <p><strong className="text-[var(--text-primary)]">5. Privacy</strong><br />Your privacy is important to us. Please refer to our Privacy Policy section below for details on how we handle your data.</p>

          <p><strong className="text-[var(--text-primary)]">6. Limitation of Liability</strong><br />FoundIt acts as a facilitation platform only. We are not responsible for the actual recovery of lost items, the accuracy of user-submitted reports, or any disputes between users.</p>

          <p><strong className="text-[var(--text-primary)]">7. Termination</strong><br />We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful behavior.</p>

          <p><strong className="text-[var(--text-primary)]">8. Changes to Terms</strong><br />We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
        </div>
      </div>

      <div className="glass-panel p-4 sm:p-6 rounded-lg space-y-3 leading-relaxed">
        <h3 className="font-serif-heading text-sm sm:text-base font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
          Privacy Policy
        </h3>
        <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] space-y-3">
          <p><strong className="text-[var(--text-primary)]">1. Information We Collect</strong><br />We collect your name, email address, and profile information when you register. We also collect information about items you report (descriptions, images, locations) to facilitate matching and recovery.</p>

          <p><strong className="text-[var(--text-primary)]">2. How We Use Your Information</strong><br />Your information is used to: create and manage your account, display your reports to other users, match lost and found items, send notifications about potential matches, and improve our services.</p>

          <p><strong className="text-[var(--text-primary)]">3. Data Sharing</strong><br />Contact information (phone, email) provided in item reports is visible to other users to facilitate item recovery. We do not sell or share your personal data with third parties for marketing purposes.</p>

          <p><strong className="text-[var(--text-primary)]">4. Data Security</strong><br />We implement appropriate security measures to protect your personal information. Passwords are encrypted using industry-standard hashing algorithms.</p>

          <p><strong className="text-[var(--text-primary)]">5. Cookies</strong><br />We use essential cookies for authentication and session management. No tracking cookies are used.</p>

          <p><strong className="text-[var(--text-primary)]">6. Your Rights</strong><br />You can access, update, or delete your account information at any time through your profile settings. You may also request complete account deletion by contacting us.</p>

          <p><strong className="text-[var(--text-primary)]">7. Contact</strong><br />For privacy-related inquiries, please contact: bonazeynalabid75@gmail.com</p>
        </div>
      </div>

      <div className="glass-panel p-4 sm:p-6 rounded-lg space-y-3 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-[var(--accent-green)] text-white flex items-center justify-center font-serif-heading font-bold text-xl sm:text-2xl">
          BZ
        </div>
        <h3 className="font-serif-heading text-base sm:text-lg font-semibold text-[var(--text-primary)]">
          Bona Zeynalabid
        </h3>
        <p className="text-[11px] sm:text-xs text-[var(--text-secondary)]">
          4th Year Computer Science Student
        </p>
        <p className="text-[11px] sm:text-xs text-[var(--accent-gold)] font-medium">
          Hawassa University, Ethiopia
        </p>
        <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          FoundIt was built as a capstone project demonstrating full-stack web development skills including React, Next.js, Node.js, Express, MongoDB, and Cloudinary integration. The platform showcases modern UI/UX design principles, secure authentication, real-time matching algorithms, and community-driven features.
        </p>
        <div className="flex justify-center gap-3 sm:gap-4 pt-2 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider flex-wrap">
          <span>Next.js</span>
          <span className="hidden sm:inline">•</span>
          <span>Express</span>
          <span className="hidden sm:inline">•</span>
          <span>MongoDB</span>
          <span className="hidden sm:inline">•</span>
          <span>Cloudinary</span>
        </div>
        <p className="text-[10px] text-[var(--text-secondary)] pt-2">
          © 2026 FoundIt. All rights reserved.
        </p>
      </div>
    </div>
  );
}