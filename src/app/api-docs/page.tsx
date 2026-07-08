"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { 
  Terminal, 
  Globe, 
  Cpu, 
  Code, 
  Play, 
  BookOpen, 
  Lock, 
  Check, 
  Copy,
  Zap,
  Link as LinkIcon,
  ChevronRight
} from "lucide-react";

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<"player" | "shortener">("player");
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const jsPlayerCode = `// JavaScript: Fetch player profile details
fetch('https://info.killersharmabot.online/player-info?uid=3419823759')
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error("Lookup Error:", data.error);
    } else {
      console.log("Nickname:", data.basicInfo.nickname);
      console.log("Level:", data.basicInfo.level);
    }
  })
  .catch(err => console.error("Request Failed", err));`;

  const jsShortenerCode = `// JavaScript: Create a short link
fetch('/api/link/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com',
    expiry: '30d',
    verificationPages: 5
  })
})
  .then(res => res.json())
  .then(data => {
    console.log("Short link URL:", data.shortUrl);
  });`;

  const curlCreateLink = `curl -X POST "/api/link/create" \\
     -H "Content-Type: application/json" \\
     -d '{"url":"https://example.com","expiry":"30d","verificationPages":5}'`;

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="p-4 bg-[#16161F]/80 border border-white/5 rounded-2xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3">API Categories</span>
            <nav className="space-y-1 text-xs font-bold uppercase tracking-wider">
              <button 
                onClick={() => setActiveTab("player")}
                className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                  activeTab === "player" 
                    ? "bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Cpu className="h-4 w-4 text-[#FF2E93]" />
                <span>Player Info API</span>
              </button>
              <button 
                onClick={() => setActiveTab("shortener")}
                className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                  activeTab === "shortener" 
                    ? "bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <LinkIcon className="h-4 w-4 text-[#FF2E93]" />
                <span>Link Shortener API</span>
              </button>
            </nav>
          </div>

          <div className="p-4 bg-gradient-to-br from-[#FF2E93]/10 to-purple-950/15 border border-[#FF2E93]/20 rounded-2xl text-center space-y-2">
            <Zap className="h-6 w-6 text-[#FF2E93] mx-auto animate-pulse" />
            <h4 className="text-xs font-bold uppercase">Rate Limits</h4>
            <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
              Public lookups are limited to 60 requests per minute per IP address. Rate limits are server-enforced.
            </p>
          </div>
        </div>

        {/* API Docs Content */}
        <div className="lg:col-span-3 space-y-10">
          
          {/* TAB 1: PLAYER INFO API */}
          {activeTab === "player" && (
            <div className="space-y-6">
              <section id="player-intro" className="space-y-3">
                <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <span>Free Fire Player Info API</span>
                </h1>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  The Player Info lookup endpoint retrieves complete public profile info, stats, region details, equipment skins, likes counter, and ranking metadata directly from Free Fire servers.
                </p>
              </section>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-green-950 text-green-400 border border-green-800 px-3 py-1 rounded text-[10px] font-black uppercase">
                    GET
                  </span>
                  <code className="text-xs font-mono text-white bg-[#16161F] border border-white/5 px-3 py-1.5 rounded-lg flex-1">
                    https://info.killersharmabot.online/player-info?uid={'{UID}'}
                  </code>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Query Parameters</span>
                  <div className="overflow-x-auto border border-white/5 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#16161F] border-b border-white/5 text-gray-500 font-bold uppercase">
                          <th className="p-3">Parameter</th>
                          <th className="p-3">Type</th>
                          <th className="p-3 text-center">Required</th>
                          <th className="p-3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5 text-gray-300">
                          <td className="p-3 font-mono font-bold text-pink-400">uid</td>
                          <td className="p-3 font-mono">string</td>
                          <td className="p-3 text-center text-green-400 font-bold">Yes</td>
                          <td className="p-3 font-semibold text-gray-400">Numerical ID containing 8 to 12 digits representing the Free Fire account identifier.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-2 col-span-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Sample Response (200 OK)</span>
                  <pre className="bg-[#16161F] p-4 rounded-xl text-[10px] font-mono text-gray-300 overflow-x-auto max-h-96 border border-white/5">
{`{
  "basicInfo": {
    "accountId": "3419823759",
    "nickname": "TEㅤFlexxyㅤ!!",
    "level": 64,
    "liked": 17545,
    "banStatus": "Not Banned",
    "createAt": "1624948311",
    "region": "India",
    "csRank": 323,
    "csRankingPoints": 173,
    "csRankingName": "Master (86 Star)"
  }
}`}
                  </pre>
                </div>

                <div className="space-y-2 col-span-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Error Codes & Responses</span>
                  <div className="overflow-x-auto border border-white/5 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#16161F] border-b border-white/5 text-gray-500 font-bold uppercase">
                          <th className="p-3">HTTP Status</th>
                          <th className="p-3">Reason / Message</th>
                          <th className="p-3">JSON Response</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5 text-gray-300">
                          <td className="p-3 font-mono text-pink-400">400 Bad Request</td>
                          <td className="p-3 font-semibold text-gray-400">Invalid numeric format or missing query parameters.</td>
                          <td className="p-3 font-mono text-xs">{`{"error": "Please enter a valid numeric UID"}`}</td>
                        </tr>
                        <tr className="border-b border-white/5 text-gray-300">
                          <td className="p-3 font-mono text-pink-400">404 Not Found</td>
                          <td className="p-3 font-semibold text-gray-400">Specified Free Fire UID is not registered.</td>
                          <td className="p-3 font-mono text-xs">{`{"error": "Player Not Found. Please enter a valid registered Free Fire UID."}`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Sample Code (JavaScript Fetch)</span>
                  <pre className="bg-[#16161F] p-4 rounded-xl text-xs font-mono text-[#00E676] overflow-x-auto border border-white/5">
                    {jsPlayerCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LINK SHORTENER API */}
          {activeTab === "shortener" && (
            <div className="space-y-6">
              <section id="shortener-intro" className="space-y-3">
                <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <span>Link Shortener REST API</span>
                </h1>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  Use our Link Shortener endpoints to create custom short links with specific verification sequences, retrieve redirection hit statistics, delete codes, and verify secure gate states programmatically.
                </p>
              </section>

              {/* Endpoint 1: Create Link */}
              <div className="space-y-4 border-b border-white/5 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-sky-950 text-sky-400 border border-sky-800 px-3 py-1 rounded text-[10px] font-black uppercase">
                    POST
                  </span>
                  <code className="text-xs font-mono text-white bg-[#16161F] border border-white/5 px-3 py-1.5 rounded-lg flex-1">
                    /api/link/create
                  </code>
                </div>

                <p className="text-xs text-gray-400">
                  Creates a new shortened link code with optional anti-bot steps, custom verification countdown and expiration preset.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Request Payload (JSON)</span>
                    <pre className="bg-[#16161F] p-4 rounded-xl text-xs font-mono text-gray-300 border border-white/5">
{`{
  "url": "https://example.com",
  "expiry": "30d",
  "verificationPages": 5
}`}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Response payload (200 OK)</span>
                    <pre className="bg-[#16161F] p-4 rounded-xl text-xs font-mono text-[#00E676] border border-white/5">
{`{
  "success": true,
  "shortUrl": "https://yourdomain.com/l/Ab12Xy",
  "expiry": "2026-08-10T10:30:00.000Z",
  "verificationPages": 5
}`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Configuration Options</span>
                  <div className="overflow-x-auto border border-white/5 rounded-xl text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#16161F] border-b border-white/5 text-gray-500 font-bold uppercase">
                          <th className="p-3">Setting</th>
                          <th className="p-3">Available Ranges / Parameters</th>
                          <th className="p-3">Default Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5 text-gray-300">
                          <td className="p-3 font-bold text-white">verificationPages</td>
                          <td className="p-3">Integer between <code className="text-pink-400">3</code> to <code className="text-pink-400">10</code> pages.</td>
                          <td className="p-3 font-mono">3</td>
                        </tr>
                        <tr className="border-b border-white/5 text-gray-300">
                          <td className="p-3 font-bold text-white">expiry</td>
                          <td className="p-3 font-mono leading-relaxed">
                            &quot;10m&quot; (10 Min) • &quot;30m&quot; (30 Min) • &quot;1h&quot; (1 Hour) • &quot;6h&quot; (6 Hours) • &quot;12h&quot; (12 Hours) • &quot;24h&quot; (24 Hours) • &quot;7d&quot; (7 Days) • &quot;30d&quot; (30 Days) • &quot;6mo&quot; (6 Months) • &quot;lifetime&quot; (Never expire)
                          </td>
                          <td className="p-3 font-mono">&quot;24h&quot;</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Endpoint 2: Info & Stats */}
              <div className="space-y-4 border-b border-white/5 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-green-950 text-green-400 border border-green-800 px-3 py-1 rounded text-[10px] font-black uppercase">
                    GET
                  </span>
                  <code className="text-xs font-mono text-white bg-[#16161F] border border-white/5 px-3 py-1.5 rounded-lg flex-1">
                    /api/link/info?code={'{CODE}'}
                  </code>
                </div>
                <p className="text-xs text-gray-400">
                  Retrieves the meta-parameters and configuration layout settings of a shortened link.
                </p>
              </div>

              {/* Endpoint 3: Stats */}
              <div className="space-y-4 border-b border-white/5 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-green-950 text-green-400 border border-green-800 px-3 py-1 rounded text-[10px] font-black uppercase">
                    GET
                  </span>
                  <code className="text-xs font-mono text-white bg-[#16161F] border border-white/5 px-3 py-1.5 rounded-lg flex-1">
                    /api/link/stats?code={'{CODE}'}
                  </code>
                </div>
                <p className="text-xs text-gray-400">
                  Calculates redirect traffic statistics aggregates grouped by visitor devices, operating systems, browsers, and country origins.
                </p>
              </div>

              {/* Endpoint 4: Delete */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-red-950 text-red-400 border border-red-800 px-3 py-1 rounded text-[10px] font-black uppercase">
                    DELETE
                  </span>
                  <code className="text-xs font-mono text-white bg-[#16161F] border border-white/5 px-3 py-1.5 rounded-lg flex-1">
                    /api/link/delete?code={'{CODE}'}
                  </code>
                </div>
                <p className="text-xs text-gray-400">
                  Permanently deletes the shortened link record and all its associated analytical stats tables.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Sample Code (JavaScript Fetch)</span>
                <pre className="bg-[#16161F] p-4 rounded-xl text-xs font-mono text-[#00E676] overflow-x-auto border border-white/5">
                  {jsShortenerCode}
                </pre>
              </div>
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}
