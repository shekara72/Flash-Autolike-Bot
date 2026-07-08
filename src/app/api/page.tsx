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
  Zap
} from "lucide-react";

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<"js" | "python" | "curl">("js");
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const jsCode = `// Fetch player profile details in JavaScript
fetch('https://flash-autolike.site/api/player-info?uid=3419823759')
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error("Error:", data.error);
    } else {
      console.log("Player Nickname:", data.basicInfo.nickname);
      console.log("Player Level:", data.basicInfo.level);
    }
  })
  .catch(err => console.error("Request Failed", err));`;

  const pythonCode = `# Fetch player details in Python
import requests

url = "https://flash-autolike.site/api/player-info"
params = {"uid": "3419823759"}

response = requests.get(url, params=params)
data = response.json()

if "error" in data:
    print(f"Error: {data['error']}")
else:
    print(f"Nickname: {data['basicInfo']['nickname']}")
    print(f"Likes: {data['basicInfo']['like']}")`;

  const curlCode = `# Fetch player details using cURL
curl -X GET "https://flash-autolike.site/api/player-info?uid=3419823759" \\
     -H "Accept: application/json"`;

  const sampleSuccessResponse = `{
  "basicInfo": {
    "accountId": "3419823759",
    "nickname": "FL4SH_GAMER",
    "level": 74,
    "like": 14205,
    "createAt": "1609459200",
    "rankingPoints": 4120,
    "rankingName": "Heroic II",
    "csRankingPoints": 182,
    "csRankingName": "Master (86 Star)",
    "badgeId": 1001000098,
    "badgeCnt": 32,
    "ban": false
  },
  "socialInfo": {
    "signature": "[b][c][FF0099]╭─╮\\n│♡│ FLASH BOT\\n╰─╯",
    "language": "English"
  },
  "clanBasicInfo": {
    "clanId": "87541209",
    "clanName": "FLASH_ARMY",
    "clanLevel": 4
  }
}`;

  const sampleErrorResponse = `{
  "error": "Player not found. Please enter a valid registered Free Fire UID."
}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="p-4 bg-[#16161F]/80 border border-white/5 rounded-2xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3">API References</span>
            <nav className="space-y-1 text-xs font-bold uppercase tracking-wider text-gray-400">
              <a href="#introduction" className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg hover:text-white transition-all">
                <BookOpen className="h-4 w-4 text-[#FF2E93]" />
                <span>Introduction</span>
              </a>
              <a href="#rate-limits" className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg hover:text-white transition-all">
                <Zap className="h-4 w-4 text-[#FF2E93]" />
                <span>Rate Limits</span>
              </a>
              <a href="#endpoints" className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg hover:text-white transition-all">
                <Terminal className="h-4 w-4 text-[#FF2E93]" />
                <span>Endpoints</span>
              </a>
              <a href="#authentication" className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg hover:text-white transition-all">
                <Lock className="h-4 w-4 text-[#FF2E93]" />
                <span>Authentication</span>
              </a>
            </nav>
          </div>

          <div className="p-4 bg-gradient-to-br from-[#FF2E93]/10 to-purple-950/15 border border-[#FF2E93]/20 rounded-2xl text-center space-y-2">
            <Cpu className="h-6 w-6 text-[#FF2E93] mx-auto animate-pulse" />
            <h4 className="text-xs font-bold uppercase">Need Private Access?</h4>
            <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
              Contact our development team via Telegram for dedicated API nodes and custom queries limit.
            </p>
          </div>
        </div>

        {/* API Docs Content */}
        <div className="lg:col-span-3 space-y-10">
          
          {/* 1. INTRODUCTION */}
          <section id="introduction" className="space-y-3">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span>Developer API Documentation</span>
            </h1>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              Welcome to the Flash Autolike public REST API. Our player lookup endpoints allow game developers, Discord bot designers, and guild managers to programmatically fetch complete profile cards, ban statuses, level metrics, pet specifications, and clan rosters directly from Free Fire game servers in real-time.
            </p>
          </section>

          {/* 2. RATE LIMITS */}
          <section id="rate-limits" className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Zap className="h-4 w-4 text-[#FF2E93]" />
              <span>Rate Limits & Availability</span>
            </h3>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              To prevent server resource starvation, our public endpoint is rate-limited on a per-IP basis. Exceeding these limits triggers an HTTP status code <code className="text-[#FF2E93] font-mono bg-white/5 px-1.5 py-0.5 rounded">429 Too Many Requests</code>.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
              <div className="p-3 bg-[#16161F] border border-white/5 rounded-xl text-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase block">Public Rate Limit</span>
                <span className="text-lg font-black text-white font-mono">60 Req / Min</span>
              </div>
              <div className="p-3 bg-[#16161F] border border-white/5 rounded-xl text-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase block">Daily Endpoint Quota</span>
                <span className="text-lg font-black text-white font-mono">1,000 Req / Day</span>
              </div>
            </div>
          </section>

          {/* 3. ENDPOINTS */}
          <section id="endpoints" className="space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Terminal className="h-4 w-4 text-[#FF2E93]" />
              <span>API Endpoint Specification</span>
            </h3>

            {/* GET PLAYER INFO SPEC */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-green-950 text-green-400 border border-green-800 px-3 py-1 rounded text-[10px] font-black uppercase">
                  GET
                </span>
                <code className="text-xs font-mono text-white bg-[#16161F] border border-white/5 px-3 py-1.5 rounded-lg flex-1">
                  /api/player-info?uid={'{UID}'}
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
                        <td className="p-3 font-semibold text-gray-400">Numeric UID containing 5 to 15 digits. Reject text immediately.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Code blocks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <Code className="h-3.5 w-3.5 text-[#FF2E93]" /> Code Implementations
                  </span>
                  
                  <div className="flex gap-2">
                    {["js", "python", "curl"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                          activeTab === tab 
                            ? "bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/30" 
                            : "text-gray-500 hover:text-white"
                        }`}
                      >
                        {tab === "js" ? "JS Fetch" : tab === "python" ? "Python" : "cURL"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <button 
                    onClick={() => handleCopyCode(activeTab === "js" ? jsCode : activeTab === "python" ? pythonCode : curlCode)}
                    className="absolute top-3 right-3 p-1.5 bg-[#0B0B0F] border border-white/5 rounded text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    {copiedText ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <pre className="bg-[#16161F] p-4 rounded-xl text-xs font-mono text-[#00E676] overflow-x-auto max-h-64 border border-white/5">
                    {activeTab === "js" ? jsCode : activeTab === "python" ? pythonCode : curlCode}
                  </pre>
                </div>
              </div>

              {/* Success Response Spec */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Sample Response (200 OK)</span>
                  <pre className="bg-[#16161F] p-4 rounded-xl text-[10px] font-mono text-gray-300 overflow-x-auto max-h-72 border border-white/5">
                    {sampleSuccessResponse}
                  </pre>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Sample Response (404 Error)</span>
                  <pre className="bg-[#16161F] p-4 rounded-xl text-[10px] font-mono text-red-400 overflow-x-auto border border-white/5">
                    {sampleErrorResponse}
                  </pre>
                </div>
              </div>

            </div>
          </section>

          {/* 4. AUTHENTICATION */}
          <section id="authentication" className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Lock className="h-4 w-4 text-[#FF2E93]" />
              <span>Authentication Requirements</span>
            </h3>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              Public lookups do not require custom tokens or headers. If you require private API nodes, dedicated rates, or higher concurrency limits, authentication must be added via custom request header:
            </p>
            <code className="block text-xs font-mono text-white bg-[#16161F] border border-white/5 px-4 py-2.5 rounded-xl">
              Authorization: Bearer {'{YOUR_SECRET_TOKEN}'}
            </code>
          </section>

        </div>

      </main>

      <Footer />
    </div>
  );
}
