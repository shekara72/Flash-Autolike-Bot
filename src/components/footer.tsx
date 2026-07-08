import Link from "next/link";
import { MessageSquare, Send, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0F] border-t border-[rgba(255,255,255,0.06)] pt-16 pb-8 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 border-b border-[rgba(255,255,255,0.06)] pb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <span className="text-lg font-black tracking-tight text-white uppercase">
                FLASH AUTOLIKE<span className="text-[#FF2E93] text-xl font-black">.</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Providing premium, instant autolike interactions for bot operations and social engagements. Safe, secure, and fast.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-semibold">
              <li><Link href="/#features" className="hover:text-[#FF2E93] transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-[#FF2E93] transition-colors">How It Works</Link></li>
              <li><Link href="/#pricing" className="hover:text-[#FF2E93] transition-colors">Pricing Options</Link></li>
              <li><Link href="/#proof-gallery" className="hover:text-[#FF2E93] transition-colors">Proof Gallery</Link></li>
            </ul>
          </div>

          {/* Support options */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Help</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-semibold">
              <li><Link href="/#faq" className="hover:text-[#FF2E93] transition-colors">FAQ Help Center</Link></li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#FF2E93]" />
                <span className="text-gray-300">support@flash-autolike.bot</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#FF2E93]" />
                <span className="text-gray-300">Live Support Tickets</span>
              </li>
            </ul>
          </div>

          {/* Call to action for Telegram */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Join Telegram</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Get immediate alerts, bot updates, or chat with our live customer support channel.
            </p>
            <a
              href="https://t.me/FL4SH_AUTOLIKE_BOT"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              id="footer-telegram-btn"
            >
              <Send className="h-4 w-4 fill-white" />
              <span>Contact Telegram Support</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-semibold gap-4">
          <p>© {new Date().getFullYear()} Flash Autolike Bot. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#FF2E93] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#FF2E93] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
