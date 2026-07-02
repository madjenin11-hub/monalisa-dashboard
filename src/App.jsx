import React, { useState, useEffect, useRef } from 'react';
import './pln-human-corporate.css';
import { 
  Activity, 
  Database, 
  Users, 
  BarChart3, 
  FileText, 
  Send, 
  Settings, 
  AlertTriangle, 
  BookOpen, 
  PlusCircle, 
  Edit3, 
  HelpCircle, 
  Search, 
  UserCheck, 
  LogOut, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  FileSpreadsheet, 
  MessageSquare,
  ArrowRight,
  Download,
  Info,
  ChevronRight,
  User
} from 'lucide-react';

// Master Customer Database (Jan - Dec Power Usage in kWh)
const INITIAL_CUSTOMERS = [
  {
    idpel: "141001728156",
    nama: "PT Semesta Makmur Abadi",
    tarif: "I3/TM",
    daya: "345,000 VA",
    siteCode: "S-PLG01",
    siteName: "Gardu Induk Jakabaring",
    alamat: "Jl. Gubenur H. Bastari No.15, Palembang",
    noMeter: "98274011",
    merkMeter: "EDMI",
    typeMeter: "Mk6E",
    merkModem: "Maestro",
    tikor: "-3.018251,104.792440",
    diagramFasor: "https://example.com/fasor/141001728156.jpg",
    jan: 24500, feb: 23100, mar: 25800, apr: 22900, mei: 26100, jun: 27500,
    jul: 28200, ags: 29100, sep: 27900, okt: 28500, nov: 26800, des: 29900
  },
  {
    idpel: "141001729302",
    nama: "Siloam Hospitals Palembang",
    tarif: "P2/TM",
    daya: "554,000 VA",
    siteCode: "S-PLG02",
    siteName: "Penyulang Kemuning",
    alamat: "Jl. Pom IX, Lorok Pakjo, Palembang",
    noMeter: "87340112",
    merkMeter: "Itron",
    typeMeter: "SL7000",
    merkModem: "Wavecom",
    tikor: "-2.987342,104.749381",
    diagramFasor: "https://example.com/fasor/141001729302.jpg",
    jan: 42100, feb: 41200, mar: 43500, apr: 40900, mei: 44200, jun: 45000,
    jul: 45800, ags: 46200, sep: 44100, okt: 45900, nov: null, des: null
  },
  {
    idpel: "141001730415",
    nama: "Mall Palembang Icon",
    tarif: "B3/TM",
    daya: "1,110,000 VA",
    siteCode: "S-PLG03",
    siteName: "Gardu Hubung Angkatan 45",
    alamat: "Jl. Angkatan 45, Lorok Pakjo, Palembang",
    noMeter: "92183742",
    merkMeter: "EDMI",
    typeMeter: "Mk10",
    merkModem: "Sierra",
    tikor: "-2.989254,104.746193",
    diagramFasor: "https://example.com/fasor/141001730415.jpg",
    jan: 89000, feb: 87500, mar: 91200, apr: 88400, mei: 93200, jun: 95400,
    jul: 97800, ags: 99100, sep: 96500, okt: 98400, nov: 95000, des: 102000
  },
  {
    idpel: "141001735119",
    nama: "PT Sriwijaya Pupuk Utama",
    tarif: "I4/TT",
    daya: "3,500,000 VA",
    siteCode: "S-PLG04",
    siteName: "Penyulang Pusri",
    alamat: "Jl. Mayor Zen, Kalidoni, Palembang",
    noMeter: "72194301",
    merkMeter: "Landis+Gyr",
    typeMeter: "E650",
    merkModem: "Cinterion",
    tikor: "-2.971239,104.810234",
    diagramFasor: "https://example.com/fasor/141001735119.jpg",
    jan: 290000, feb: 285000, mar: 310000, apr: null, mei: 315000, jun: 320000,
    jul: 325000, ags: 330000, sep: 318000, okt: 322000, nov: 305000, des: 340000
  },
  {
    idpel: "141001741250",
    nama: "Universitas Sriwijaya (UNSRI)",
    tarif: "P2/TM",
    daya: "197,000 VA",
    siteCode: "S-PLG05",
    siteName: "Penyulang Bukit",
    alamat: "Jl. Padang Selasa No.524, Palembang",
    noMeter: "83011492",
    merkMeter: "EDMI",
    typeMeter: "Mk6E",
    merkModem: "Maestro",
    tikor: "-2.992812,104.731902",
    diagramFasor: "",
    jan: 12500, feb: 11900, mar: 13200, apr: 12800, mei: 13500, jun: 14000,
    jul: 14200, ags: 14500, sep: 13900, okt: 14100, nov: 13600, des: 14800
  }
];

// Query Log from WhatsApp Client
const INITIAL_QUERY_LOGS = [
  { time: "2026-06-22 10:05:12", sender: "6281274839201", keyword: "CEK 141001728156", idpel: "141001728156", status: "Ditemukan" },
  { time: "2026-06-22 09:54:30", sender: "6282194830112", keyword: "GRAFIK 141001729302", idpel: "141001729302", status: "Ditemukan" },
  { time: "2026-06-22 09:41:15", sender: "6285390112843", keyword: "UPDATE 141001735119 MARET 312000", idpel: "141001735119", status: "Ditemukan" },
  { time: "2026-06-22 09:12:05", sender: "6281394110394", keyword: "CEK 141001799999", idpel: "141001799999", status: "Tidak Ditemukan" }
];

// Log WhatsApp Grafik Sent
const INITIAL_WA_CHART_LOGS = [
  { time: "2026-06-22 10:05:15", idpel: "141001728156", nama: "PT Semesta Makmur Abadi", url: "https://chart.monalisa.pln.co.id/render?idpel=141001728156", messageId: "g.us:WA-98127391-01", status: "Sukses" },
  { time: "2026-06-22 09:54:35", idpel: "141001729302", nama: "Siloam Hospitals Palembang", url: "https://chart.monalisa.pln.co.id/render?idpel=141001729302", messageId: "g.us:WA-98127391-05", status: "Sukses" }
];

// Error Logs
const INITIAL_ERROR_LOGS = [
  { time: "2026-06-22 08:30:11", node: "WhatsApp Gateway Connection", message: "Failed to reconnect to WA Web socket", executionId: "EX-9923841", cause: "Network timeout", fix: "Auto-reconnect triggered successfully after 5s", status: "Selesai" },
  { time: "2026-06-21 17:15:45", node: "AI Analytics Node", message: "Empty power log reading on Siloam Hospital November/December", executionId: "EX-9912044", cause: "Missing billing database insert", fix: "Awaiting operator manual updates", status: "Pending" }
];

// Audit Trails (EDIT_LOG)
const INITIAL_EDIT_LOGS = [
  { time: "2026-06-22 09:41:16", user: "Operator-WA", idpel: "141001735119", field: "mar", oldVal: "310000", newVal: "312000", source: "WhatsApp" },
  { time: "2026-06-21 14:10:00", user: "Admin (Dian)", idpel: "141001728156", field: "daya", oldVal: "340,000 VA", newVal: "345,000 VA", source: "Dashboard" }
];

// PLN Human Corporate Theme: bersih, profesional, dan tidak terlalu AI
const THEME = {
  bgLight: "bg-[#F5F8FC]",
  bgHeader: "bg-[#073B75]",
  bgSidebar: "bg-white",
  borderLight: "border-slate-200",
  textDark: "text-[#172033]",
  textSecondary: "text-[#667085]",
  plnBlue: "#0072CE",
  plnBlueText: "text-[#0072CE]",
  goldAccent: "#F2C94C",
  goldText: "text-[#B7791F]"
};

// Helper function to render official PLN logo image verbatim
const PLNLogo = ({ className = "h-8 w-auto" }) => {
  const logoPath = `${import.meta.env.BASE_URL || "/"}pln-logo.svg`;

  return (
    <span className="pln-logo-safe" aria-label="PLN">
      <img
        src={logoPath}
        alt="PLN MONA LISA Logo"
        className={`${className} object-contain pln-logo-safe__img`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.style.display = "none";
          const fallback = e.currentTarget.parentElement?.querySelector(".pln-logo-safe__fallback");
          if (fallback) fallback.style.display = "inline-flex";
        }}
      />
      <span className="pln-logo-safe__fallback">PLN</span>
    </span>
  );
};



const CorporateStatusStrip = ({ customers, queryLogs, waChartLogs, errorLogs, currentTime }) => {
  const partialData = customers.filter((c) => Object.values(c).includes(null)).length;
  const pendingErrors = errorLogs.filter((item) => item.status !== "Selesai").length;

  return (
    <section className="pln-status-strip">
      <div className="pln-status-strip__title">
        <span className="pln-status-strip__eyebrow">MONA LISA 2.0</span>
        <h2>Dashboard Operasional PLN</h2>
        <p>Monitoring data pelanggan, grafik pemakaian, WhatsApp gateway, audit log, dan AI insight dalam satu panel kerja.</p>
      </div>

      <div className="pln-status-strip__items">
        <div className="pln-status-mini-card"><span>Pelanggan</span><strong>{customers.length}</strong></div>
        <div className="pln-status-mini-card"><span>Request WA</span><strong>{queryLogs.length}</strong></div>
        <div className="pln-status-mini-card"><span>Grafik Terkirim</span><strong>{waChartLogs.length}</strong></div>
        <div className="pln-status-mini-card"><span>Data Parsial</span><strong>{partialData}</strong></div>
        <div className="pln-status-mini-card pln-status-mini-card--alert"><span>Error Pending</span><strong>{pendingErrors}</strong></div>
        <div className="pln-status-mini-card pln-status-mini-card--time"><span>Waktu Sistem</span><strong>{currentTime} WIB</strong></div>
      </div>
    </section>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: "", role: "Super Admin" });
  const [activeTab, setActiveTab] = useState("Dashboard Utama");
  
  // Database States
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [queryLogs, setQueryLogs] = useState(INITIAL_QUERY_LOGS);
  const [waChartLogs, setWaChartLogs] = useState(INITIAL_WA_CHART_LOGS);
  const [errorLogs, setErrorLogs] = useState(INITIAL_ERROR_LOGS);
  const [editLogs, setEditLogs] = useState(INITIAL_EDIT_LOGS);

  // Interface control states
  const [searchIdpel, setSearchIdpel] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("141001728156");
  const [waSimMessage, setWaSimMessage] = useState("");
  const [waSimResponses, setWaSimResponses] = useState([
    { role: 'system', text: "MONA LISA WA Gateway aktif. Silahkan kirim perintah update/tambah data." }
  ]);
  const [systemNotification, setSystemNotification] = useState(null);

  // AI Proxy / 9Router states
  const [aiInsightResult, setAiInsightResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [customAiPrompt, setCustomAiPrompt] = useState("");

  const [aiChatHistory, setAiChatHistory] = useState([
    { role: "model", text: "Halo! Saya adalah Asisten Virtual MONA LISA. Ada yang bisa saya bantu terkait analisis beban, troubleshooting gateway, atau data pelanggan hari ini?" }
  ]);
  const [aiChatInput, setAiChatInput] = useState("");
  const [isAiChatLoading, setIsAiChatLoading] = useState(false);

  const [selectedErrorForAi, setSelectedErrorForAi] = useState(null);
  const [aiErrorFixSuggestion, setAiErrorFixSuggestion] = useState("");
  const [isAiErrorLoading, setIsAiErrorLoading] = useState(false);

  const [aiTone, setAiTone] = useState("Sopan & Formal");
  const [aiCustomBroadcast, setAiCustomBroadcast] = useState("");
  const [isAiBroadcasting, setIsAiBroadcasting] = useState(false);

  // Edit / Add data forms
  const [updateFormData, setUpdateFormData] = useState({
    idpel: "", fieldName: "jan", newValue: ""
  });
  
  const [newCustForm, setNewCustForm] = useState({
    idpel: "", nama: "", tarif: "I3/TM", daya: "345,000 VA", siteCode: "S-PLG01", siteName: "",
    alamat: "", noMeter: "", merkMeter: "EDMI", typeMeter: "", merkModem: "", tikor: "",
    jan: "0", feb: "0", mar: "0", apr: "0", mei: "0", jun: "0",
    jul: "0", ags: "0", sep: "0", okt: "0", nov: "0", des: "0"
  });

  // Config States
  const [systemConfig, setSystemConfig] = useState({
    waEndpoint: "https://api.monalisa.pln.co.id/v1/whatsapp/send",
    apiKey: "PLN_MONALISA_SECURE_TOKEN_P4",
    searchKeyword: "CEK",
    captionFormat: "Yth. Pelanggan {NAMA} (IDPEL {IDPEL}) dengan daya {DAYA}. Berikut merupakan grafik pemakaian energi listrik Anda.",
    isAiEnabled: true,
    isWaGatewayEnabled: true
  });

  // Real-time clock hook
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("id-ID"));
  useEffect(() => {
    // Jam dibuat statis agar dashboard tidak re-render terus menerus.
    // Ini mencegah efek berkedip / Waiting for localhost berulang saat development.
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
  }, []);

  // Show dynamic self-destructing toast notifications
  const notify = (msg, type = "success") => {
    setSystemNotification({ text: msg, type });
    setTimeout(() => {
      setSystemNotification(null);
    }, 4500);
  };

  const generateAiInsights = async (customPromptText = "") => {
    setIsAiLoading(true);
    setAiInsightResult("");

    const selectedCustomer =
      customers.find((c) => c.idpel === selectedCustomerId) || customers[0];

    const payload = {
      context:
        customPromptText ||
        "Analisis pelanggan dari Dashboard MONA LISA P4. Berikan ringkasan, temuan utama, potensi risiko, dan rekomendasi tindak lanjut dalam bahasa Indonesia formal.",
      data: {
        idpel: selectedCustomer?.idpel,
        nama: selectedCustomer?.nama,
        tarif: selectedCustomer?.tarif,
        daya: selectedCustomer?.daya,
        site_code: selectedCustomer?.siteCode,
        site_name: selectedCustomer?.siteName,
        modem: selectedCustomer?.merkModem,
        alamat: selectedCustomer?.alamat,
        no_meter: selectedCustomer?.noMeter,
        merk_meter: selectedCustomer?.merkMeter,
        type_meter: selectedCustomer?.typeMeter,
        tikor: selectedCustomer?.tikor,
        pemakaian: {
          jan: selectedCustomer?.jan,
          feb: selectedCustomer?.feb,
          mar: selectedCustomer?.mar,
          apr: selectedCustomer?.apr,
          mei: selectedCustomer?.mei,
          jun: selectedCustomer?.jun,
          jul: selectedCustomer?.jul,
          ags: selectedCustomer?.ags,
          sep: selectedCustomer?.sep,
          okt: selectedCustomer?.okt,
          nov: selectedCustomer?.nov,
          des: selectedCustomer?.des,
        },
        status_data: selectedCustomer?.status || selectedCustomer?.statusData || "Dashboard Dummy",
      },
    };

    try {
      const response = await fetch("http://127.0.0.1:8787/api/ai-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.insight) {
          setAiInsightResult(result.insight);
          notify(result.message || "AI utama gagal. Menampilkan analisis offline.", "warning");
          return;
        }
        throw new Error(result.message || result.error || "AI Insight gagal dibuat");
      }

      setAiInsightResult(result.insight || "AI berhasil merespons, tetapi insight kosong.");
      notify("Analisis AI MONA LISA berhasil dihasilkan melalui 9Router!", "success");
    } catch (error) {
      console.error(error);
      setAiInsightResult(`### ⚠️ AI Insight Tidak Dapat Dihasilkan

Sistem gagal menghubungi AI Proxy MONA LISA.

**Kemungkinan penyebab:**
* AI Proxy belum aktif di port 8787.
* 9Router belum aktif di port 20128.
* Provider AI sedang cooldown/risk control.
* Koneksi lokal antara dashboard, proxy, dan 9Router terputus.

**Detail error:**
${error.message}`);
      notify("Gagal memanggil AI Proxy. Cek terminal AI Proxy dan 9Router.", "warning");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiChatSubmit = async (e) => {
    e.preventDefault();
    if (!aiChatInput.trim() || isAiChatLoading) return;

    const userText = aiChatInput.trim();
    setAiChatInput("");
    const updatedHistory = [...aiChatHistory, { role: "user", text: userText }];
    setAiChatHistory(updatedHistory);
    setIsAiChatLoading(true);

    try {
      const customerContext = customers.map(c => 
        `IDPEL: ${c.idpel}, Nama: ${c.nama}, Tarif/Daya: ${c.tarif}/${c.daya}, Site: ${c.siteName || '-'}`
      ).join("\n");

      const systemPrompt = `Anda adalah MONA LISA Copilot, asisten cerdas berdedikasi tinggi PLN Unit Induk Distribusi. Anda memiliki pemahaman mendalam tentang AMR, meter prabayar/pascabayar, diagram fasor, serta pemeliharaan server IoT.
      Berikut adalah ringkasan data pelanggan aktif saat ini di database Anda:\n${customerContext}\nJawablah dengan nada yang sangat profesional, mendidik, and taktis menggunakan format Markdown.`;

      const geminiContents = updatedHistory.map(item => ({
        role: item.role === "model" ? "model" : "user",
        parts: [{ text: item.text }]
      }));

      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiContents,
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const result = await response.json();
      const reply = result.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, sistem AI asisten sedang sibuk. Silakan coba sesaat lagi.";

      setAiChatHistory(prev => [...prev, { role: "model", text: reply }]);
    } catch (error) {
      console.error(error);
      setAiChatHistory(prev => [...prev, { role: "model", text: "⚠️ Koneksi ke AI gateway terputus. Silakan pastikan sambungan internet Anda stabil." }]);
    } finally {
      setIsAiChatLoading(false);
    }
  };

  const handleAiErrorTroubleshoot = async (errorItem) => {
    setSelectedErrorForAi(errorItem);
    setAiErrorFixSuggestion("");
    setIsAiErrorLoading(true);

    const systemPrompt = "Anda adalah Pakar Infrastruktur IT & Senior DevOps Engineer PLN UID Palembang. Berikan petunjuk troubleshooting teknis mendetail, aman, dan langsung ke akar masalah berdasarkan error jaringan/gateway ini.";
    const prompt = `Layanan bermasalah: ${errorItem.node}\nPesan Kesalahan: ${errorItem.message}\nExecution ID: ${errorItem.executionId}\nPenyebab: ${errorItem.cause}\n\nBerikan 3 langkah perbaikan yang harus dieksekusi operator dalam bentuk poin-poin yang jelas dan ringkas.`;

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      const result = await response.json();
      const reply = result.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal menghubungi mesin diagnosa.";
      setAiErrorFixSuggestion(reply);
    } catch (err) {
      setAiErrorFixSuggestion("⚠️ Kegagalan koneksi AI. Silakan periksa konektivitas internet gardu.");
    } finally {
      setIsAiErrorLoading(false);
    }
  };

  const handleAiBroadcastGenerate = async () => {
    setIsAiBroadcasting(true);
    setAiCustomBroadcast("");

    const systemPrompt = "Anda adalah Kepala Hubungan Pelanggan PT PLN (Persero). Anda sangat memahami cara berkomunikasi yang diplomatis dan memiliki citra tinggi.";
    const prompt = `Sapaan pelanggan: ${activeCustomer.nama}\nIDPEL: ${activeCustomer.idpel}\nDaya Kontrak: ${activeCustomer.daya}\nLink Grafik Pemakaian: https://chart.monalisa.pln.co.id/render?idpel=${activeCustomer.idpel}\n\nBuat draf pesan WhatsApp dengan nada bicara: "${aiTone}". Pesan harus menyampaikan bahwa visualisasi konsumsi listrik bulanan mereka siap dipantau lewat link grafik di atas agar transparan. Jangan letakkan label placeholder, langsung isi data pelanggan asli.`;

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      const result = await response.json();
      const reply = result.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal menyusun draf pesan visualisasi.";
      setAiCustomBroadcast(reply);
      notify("Draf pesan broadcast AI berhasil disusun!", "success");
    } catch (err) {
      setAiCustomBroadcast("⚠️ Gagal menyusun pesan AI. Silakan gunakan template dasar.");
    } finally {
      setIsAiBroadcasting(false);
    }
  };

  // AI Insight tidak dijalankan otomatis saat dashboard dibuka.
  // Jalankan manual melalui tombol Refresh Analisis AI agar tidak memicu rate limit/risk control.
  useEffect(() => {
    // intentionally disabled
  }, [isLoggedIn]);

  const handleWaCommandSend = (e) => {
    e.preventDefault();
    if (!waSimMessage.trim()) return;

    const msg = waSimMessage.trim();
    const newBubbleUser = { role: 'user', text: msg };
    setWaSimResponses(prev => [...prev, newBubbleUser]);

    // Parsing commands
    const uppercaseMsg = msg.toUpperCase();
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Command patterns
    const updatePattern = /^UPDATE\s+(\d+)\s+([A-Z]+)\s+(\d+)$/;
    const tikorPattern = /^UPDATE\s+IDPEL\s+(\d+)\s+TIKOR\s+([\d.-]+,[\d.-]+)$/;
    const cekPattern = /^CEK\s+(\d+)$/;

    setTimeout(() => {
      if (updatePattern.test(uppercaseMsg)) {
        const [, targetIdpel, month, value] = uppercaseMsg.match(updatePattern);
        const index = customers.findIndex(c => c.idpel === targetIdpel);
        const monthKey = month.toLowerCase().substring(0, 3);
        const validMonths = ["jan", "feb", "mar", "apr", "mei", "jun", "jul", "ags", "sep", "okt", "nov", "des"];

        if (index !== -1 && validMonths.includes(monthKey)) {
          const oldVal = customers[index][monthKey] !== null ? customers[index][monthKey].toString() : "-";
          
          setCustomers(prev => {
            const copy = [...prev];
            copy[index][monthKey] = parseInt(value, 10);
            return copy;
          });

          const newAudit = {
            time: nowStr,
            user: "Operator-WA",
            idpel: targetIdpel,
            field: monthKey,
            oldVal: oldVal,
            newVal: value,
            source: "WhatsApp"
          };
          setEditLogs(prev => [newAudit, ...prev]);

          setQueryLogs(prev => [{ time: nowStr, sender: "6281200001111", keyword: msg, idpel: targetIdpel, status: "Ditemukan" }, ...prev]);

          setWaSimResponses(prev => [...prev, {
            role: 'system',
            text: `✅ UPDATE BERHASIL!\nIDPEL: ${targetIdpel}\nPelanggan: ${customers[index].nama}\nBulan: ${month}\nData lama: ${oldVal} kWh\nData baru: ${value} kWh.\nDatabase telah dimutakhirkan & tercatat di EDIT_LOG.`
          }]);
          notify(`Data ${customers[index].nama} diperbarui via WA!`, "success");
        } else {
          setWaSimResponses(prev => [...prev, {
            role: 'system',
            text: `❌ UPDATE GAGAL. IDPEL tidak ditemukan atau format bulan salah. Pastikan bulan menggunakan nama penuh (MARET, MEI, dll).`
          }]);
        }
      } 
      else if (tikorPattern.test(uppercaseMsg)) {
        const [, targetIdpel, coords] = msg.match(/UPDATE\s+IDPEL\s+(\d+)\s+TIKOR\s+([\d.-]+,[\d.-]+)/i);
        const index = customers.findIndex(c => c.idpel === targetIdpel);

        if (index !== -1) {
          const oldVal = customers[index].tikor || "-";
          setCustomers(prev => {
            const copy = [...prev];
            copy[index].tikor = coords;
            return copy;
          });

          const newAudit = {
            time: nowStr,
            user: "Operator-WA",
            idpel: targetIdpel,
            field: "tikor",
            oldVal: oldVal,
            newVal: coords,
            source: "WhatsApp"
          };
          setEditLogs(prev => [newAudit, ...prev]);
          setQueryLogs(prev => [{ time: nowStr, sender: "6281200001111", keyword: msg, idpel: targetIdpel, status: "Ditemukan" }, ...prev]);

          setWaSimResponses(prev => [...prev, {
            role: 'system',
            text: `✅ UPDATE TIKOR BERHASIL!\nIDPEL: ${targetIdpel}\nPelanggan: ${customers[index].nama}\nKoordinat baru: ${coords}.\nLink peta digital telah dimutakhirkan.`
          }]);
          notify(`Koordinat ${customers[index].nama} diperbarui!`, "success");
        } else {
          setWaSimResponses(prev => [...prev, { role: 'system', text: "❌ IDPEL tidak ditemukan." }]);
        }
      } 
      else if (cekPattern.test(uppercaseMsg)) {
        const [, targetIdpel] = uppercaseMsg.match(cekPattern);
        const cust = customers.find(c => c.idpel === targetIdpel);

        if (cust) {
          setQueryLogs(prev => [{ time: nowStr, sender: "6281200001111", keyword: msg, idpel: targetIdpel, status: "Ditemukan" }, ...prev]);
          setWaSimResponses(prev => [...prev, {
            role: 'system',
            text: `ℹ️ DETAIL PELANGGAN MONA LISA:\nIDPEL: ${cust.idpel}\nNama: ${cust.nama}\nTarif/Daya: ${cust.tarif} / ${cust.daya}\nAlamat: ${cust.alamat}\nTikor: ${cust.tikor}\nKetik "GRAFIK ${cust.idpel}" untuk memicu render bagan.`
          }]);
        } else {
          setQueryLogs(prev => [{ time: nowStr, sender: "6281200001111", keyword: msg, idpel: targetIdpel, status: "Tidak Ditemukan" }, ...prev]);
          setWaSimResponses(prev => [...prev, { role: 'system', text: `❌ IDPEL ${targetIdpel} tidak terdaftar di Master Database MONA LISA.` }]);
        }
      }
      else if (uppercaseMsg.startsWith("GRAFIK ")) {
        const targetIdpel = uppercaseMsg.split(" ")[1];
        const cust = customers.find(c => c.idpel === targetIdpel);

        if (cust) {
          const msgId = `g.us:WA-GEN-${Math.floor(Math.random()*900000)+100000}`;
          setWaChartLogs(prev => [{
            time: nowStr,
            idpel: cust.idpel,
            nama: cust.nama,
            url: `https://chart.monalisa.pln.co.id/render?idpel=${cust.idpel}`,
            messageId: msgId,
            status: "Sukses"
          }, ...prev]);

          setWaSimResponses(prev => [...prev, {
            role: 'system',
            text: `📊 GRAFIK TERKIRIM!\nIDPEL: ${cust.idpel}\nSistem telah menghasilkan file visualisasi pemakaian pelanggan dan mengirimkannya ke WA operator.\n[URL Grafik: https://chart.monalisa.pln.co.id/render?idpel=${cust.idpel}]`
          }]);
          notify(`Grafik WA dikirim untuk ${cust.nama}!`, "success");
        } else {
          setWaSimResponses(prev => [...prev, { role: 'system', text: "❌ Grafik gagal di-render. IDPEL tidak dikenal." }]);
        }
      }
      else {
        setWaSimResponses(prev => [...prev, {
          role: 'system',
          text: `❓ Format Perintah Tidak Dikenal.\n\nGunakan format:\n1. UPDATE [IDPEL] [BULAN] [NILAI]\nContoh: UPDATE 141001728156 MARET 25000\n\n2. UPDATE IDPEL [IDPEL] TIKOR [LAT,LONG]\nContoh: UPDATE IDPEL 141001728156 TIKOR -3.0182,104.7924\n\n3. CEK [IDPEL]\nContoh: CEK 141001728156`
        }]);
      }
    }, 800);

    setWaSimMessage("");
  };

  const handleDashboardUpdateSubmit = (e) => {
    e.preventDefault();
    const { idpel, fieldName, newValue } = updateFormData;
    if (!idpel || !newValue) {
      notify("Harap isi semua kolom form update!", "error");
      return;
    }

    const index = customers.findIndex(c => c.idpel === idpel);
    if (index === -1) {
      notify("IDPEL tidak ditemukan dalam database!", "error");
      return;
    }

    const oldVal = customers[index][fieldName] !== null ? customers[index][fieldName].toString() : "-";
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setCustomers(prev => {
      const copy = [...prev];
      if (["jan","feb","mar","apr","mei","jun","jul","ags","sep","okt","nov","des"].includes(fieldName)) {
        copy[index][fieldName] = parseInt(newValue, 10);
      } else {
        copy[index][fieldName] = newValue;
      }
      return copy;
    });

    setEditLogs(prev => [{
      time: nowStr,
      user: `${currentUser.username} (${currentUser.role})`,
      idpel: idpel,
      field: fieldName,
      oldVal: oldVal,
      newVal: newValue,
      source: "Dashboard"
    }, ...prev]);

    notify(`Data ${customers[index].nama} berhasil dimutakhirkan!`, "success");
    setUpdateFormData({ idpel: "", fieldName: "jan", newValue: "" });
  };

  const handleTambahPelanggan = (e) => {
    e.preventDefault();
    if (!newCustForm.idpel || !newCustForm.nama || !newCustForm.daya) {
      notify("IDPEL, Nama, dan Daya wajib diisi!", "error");
      return;
    }

    const exists = customers.some(c => c.idpel === newCustForm.idpel);
    if (exists) {
      notify("IDPEL sudah terdaftar di Master Database!", "error");
      return;
    }

    const parsedCustomer = {
      ...newCustForm,
      jan: newCustForm.jan ? parseInt(newCustForm.jan, 10) : 0,
      feb: newCustForm.feb ? parseInt(newCustForm.feb, 10) : 0,
      mar: newCustForm.mar ? parseInt(newCustForm.mar, 10) : 0,
      apr: newCustForm.apr ? parseInt(newCustForm.apr, 10) : 0,
      mei: newCustForm.mei ? parseInt(newCustForm.mei, 10) : 0,
      jun: newCustForm.jun ? parseInt(newCustForm.jun, 10) : 0,
      jul: newCustForm.jul ? parseInt(newCustForm.jul, 10) : 0,
      ags: newCustForm.ags ? parseInt(newCustForm.ags, 10) : 0,
      sep: newCustForm.sep ? parseInt(newCustForm.sep, 10) : 0,
      okt: newCustForm.okt ? parseInt(newCustForm.okt, 10) : 0,
      nov: newCustForm.nov ? parseInt(newCustForm.nov, 10) : 0,
      des: newCustForm.des ? parseInt(newCustForm.des, 10) : 0,
    };

    setCustomers(prev => [...prev, parsedCustomer]);

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setEditLogs(prev => [{
      time: nowStr,
      user: `${currentUser.username} (${currentUser.role})`,
      idpel: newCustForm.idpel,
      field: "ALL (Tambah Baru)",
      oldVal: "-",
      newVal: newCustForm.nama,
      source: "Dashboard"
    }, ...prev]);

    notify(`Pelanggan baru ${newCustForm.nama} berhasil ditambahkan!`, "success");
    setNewCustForm({
      idpel: "", nama: "", tarif: "I3/TM", daya: "345,000 VA", siteCode: "S-PLG01", siteName: "",
      alamat: "", noMeter: "", merkMeter: "EDMI", typeMeter: "", merkModem: "", tikor: "",
      jan: "0", feb: "0", mar: "0", apr: "0", mei: "0", jun: "0",
      jul: "0", ags: "0", sep: "0", okt: "0", nov: "0", des: "0"
    });
  };

  // Corporate clean SVG Line Chart Component
  const RenderInteractiveChart = ({ customer }) => {
    if (!customer) return <div className="text-slate-400 p-4">Pilih pelanggan untuk memuat grafik.</div>;

    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const monthsFull = ["jan", "feb", "mar", "apr", "mei", "jun", "jul", "ags", "sep", "okt", "nov", "des"];
    
    const dataValues = monthsFull.map(m => customer[m] !== null ? customer[m] : 0);
    const maxValue = Math.max(...dataValues, 1000); 
    
    const width = 800;
    const height = 300;
    const paddingLeft = 65;
    const paddingRight = 40;
    const paddingTop = 40;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const points = dataValues.map((val, i) => {
      const x = paddingLeft + (i / 11) * chartWidth;
      const y = paddingTop + chartHeight - (val / maxValue) * chartHeight;
      return { x, y, value: val, month: months[i] };
    });

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const areaD = points.length > 0 ? `${pathD} L ${points[points.length-1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z` : "";

    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0072CE]"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-md font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 className="text-[#0072CE]" size={18} />
              Grafik Garis Pemakaian Bulanan (Januari - Desember)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">IDPEL: <span className="font-sans text-slate-700">{customer.idpel}</span> | {customer.nama}</p>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-semibold mt-2 md:mt-0">
            Daya Kontrak: <span className="text-slate-900 font-sans">{customer.daya}</span> | Tarif {customer.tarif}
          </div>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="overflow-x-auto">
          <svg className="w-full min-w-[700px] h-[300px]" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0072CE" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0072CE" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines & Left Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = paddingTop + ratio * chartHeight;
              const valueLabel = Math.round((1 - ratio) * maxValue).toLocaleString("id-ID");
              return (
                <g key={idx}>
                  <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#E5E7EB" strokeWidth="1" />
                  <text x={paddingLeft - 12} y={y + 4} fill="#6B7280" fontSize="10" textAnchor="end">{valueLabel} kWh</text>
                </g>
              );
            })}

            {/* Bottom Month Labels */}
            {points.map((p, idx) => (
              <text key={idx} x={p.x} y={height - paddingBottom + 18} fill="#4B5563" fontSize="11" textAnchor="middle">
                {p.month}
              </text>
            ))}

            {/* Area Path */}
            <path d={areaD} fill="url(#chartGradient)" />

            {/* Core Line Path */}
            <path d={pathD} fill="none" stroke="#0072CE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="monalisa-draw" />

            {/* Clean Data Points */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle cx={p.x} cy={p.y} r="4.5" fill="white" stroke="#0072CE" strokeWidth="2.5" className="monalisa-pulse-soft" />
                <circle cx={p.x} cy={p.y} r="8" fill="#0072CE" fillOpacity="0" className="hover:fill-opacity-15 transition-all duration-150" />
                
                {/* Floating Value box inside tooltip styling on hover */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <rect x={p.x - 35} y={p.y - 28} width="70" height="18" rx="4" fill="#1F2937" />
                  <text x={p.x} y={p.y - 16} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {p.value ? `${p.value.toLocaleString("id-ID")}` : "0"}
                  </text>
                </g>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0072CE]"></span> Realisasi Pemakaian Listrik (kWh)
            </div>
          </div>
          <div>Sumber Data: AMR Meter PLN Otomatis</div>
        </div>
      </div>
    );
  };

  const [loginCreds, setLoginCreds] = useState({ username: "superadmin", password: "", role: "Super Admin" });
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginCreds.username.trim()) {
      notify("Isi Username Anda!", "error");
      return;
    }
    setCurrentUser({
      username: loginCreds.username,
      role: loginCreds.role
    });
    setIsLoggedIn(true);
    notify(`Selamat datang, ${loginCreds.username}. Masuk sebagai ${loginCreds.role}.`, "success");
  };

  const activeCustomer = customers.find(c => c.idpel === selectedCustomerId) || customers[0];

  return (
    <div className={`pln-human-dashboard min-h-screen ${THEME.bgLight} ${THEME.textDark} font-sans antialiased`}>
      
      {/* Toast Notification Container */}
      {systemNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-lg">
          <div className={`w-3 h-3 rounded-full ${systemNotification.type === 'success' ? 'bg-green-500' : 'bg-amber-500'}`} />
          <span className="text-sm font-semibold text-slate-800">{systemNotification.text}</span>
        </div>
      )}

      {!isLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F8FC] relative">
          
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-md relative">
            
            <div className="flex flex-col items-center mb-6">
              <PLNLogo className="h-16 w-auto mb-3" />
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-1.5">
                MONA <span className="text-[#0072CE]">LISA</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Monthly Load Analysis & Smart Assistant</p>
              <div className="h-[2px] w-12 bg-[#0072CE] mt-3"></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Username</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={loginCreds.username}
                    onChange={(e) => setLoginCreds({...loginCreds, username: e.target.value})}
                    placeholder="Masukkan username" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={loginCreds.password}
                    onChange={(e) => setLoginCreds({...loginCreds, password: e.target.value})}
                    placeholder="Password" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Role Pengguna</label>
                <select 
                  value={loginCreds.role}
                  onChange={(e) => setLoginCreds({...loginCreds, role: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-sm"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Operator">Operator</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#0072CE] hover:bg-[#005ea8] text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2"
              >
                Masuk Sistem <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-[11px] text-slate-400">
              <span className="block font-semibold text-slate-600">MONA LISA P4 Dashboard v1.0</span>
              <span className="block mt-0.5">PT PLN (Persero) Unit Induk Distribusi</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col md:flex-row">
          
          {/* NAVIGATION SIDEBAR */}
          <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
            <div>
              {/* Sidebar Header Brand with PLN identity */}
              <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <PLNLogo className="h-9 w-auto" />
                <div>
                  <h2 className="text-base font-semibold tracking-normal text-slate-900">MONA <span className="text-[#0072CE]">LISA</span></h2>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">P4 AI MONITORING</span>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <nav className="p-4 space-y-1 overflow-y-auto max-h-[75vh]">
                <div className="text-[10px] uppercase text-slate-400 font-semibold px-3 mb-2 tracking-wider">Utama & Data</div>
                {[
                  { name: "Dashboard Utama", icon: <Activity size={16} /> },
                  { name: "Master Database", icon: <Database size={16} /> },
                  { name: "Data Pelanggan", icon: <Users size={16} /> },
                  { name: "Grafik Pemakaian", icon: <BarChart3 size={16} /> }
                ].map((menu) => (
                  <button
                    key={menu.name}
                    onClick={() => setActiveTab(menu.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === menu.name 
                        ? 'bg-slate-100 text-[#0072CE] border-l-4 border-[#00AEEF]' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {menu.icon}
                    {menu.name}
                  </button>
                ))}

                <div className="text-[10px] uppercase text-slate-400 font-semibold px-3 mt-4 mb-2 tracking-wider">WhatsApp & AI</div>
                {[
                  { name: "Query Log WA", icon: <FileText size={16} /> },
                  { name: "Log Grafik WA", icon: <MessageSquare size={16} /> },
                  { name: "AI Insight", icon: <Cpu size={16} /> },
                  { name: "WA Simulator", icon: <Smartphone size={16} /> }
                ].map((menu) => (
                  <button
                    key={menu.name}
                    onClick={() => setActiveTab(menu.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === menu.name 
                        ? 'bg-slate-100 text-[#0072CE] border-l-4 border-[#00AEEF]' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {menu.icon}
                    {menu.name}
                  </button>
                ))}

                <div className="text-[10px] uppercase text-slate-400 font-semibold px-3 mt-4 mb-2 tracking-wider">Aksi & Sistem</div>
                {[
                  { name: "Update Data", icon: <Edit3 size={16} /> },
                  { name: "Tambah Data", icon: <PlusCircle size={16} /> },
                  { name: "Error Log", icon: <AlertTriangle size={16} /> },
                  { name: "Config & Roles", icon: <Settings size={16} /> },
                  { name: "Buku Panduan", icon: <BookOpen size={16} /> }
                ].map((menu) => (
                  <button
                    key={menu.name}
                    onClick={() => setActiveTab(menu.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === menu.name 
                        ? 'bg-slate-100 text-[#0072CE] border-l-4 border-[#00AEEF]' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {menu.icon}
                    {menu.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Logged User Card footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#0072CE]/10 p-2 rounded-xl border border-[#00AEEF]/10">
                  <User className="text-[#0072CE] h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold truncate text-slate-900">{currentUser.username}</p>
                  <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase font-semibold">{currentUser.role}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition flex justify-center items-center gap-1.5"
              >
                <LogOut size={13} /> Logout
              </button>
            </div>
          </aside>

          {/* MAIN CONTAINER PANEL */}
          <main className="flex-1 flex flex-col overflow-x-hidden">
            
            {/* Header section - Height 72px, Navy PLN Background, Professional & Formal */}
            <header className="h-[72px] bg-[#073B75] text-white px-6 flex justify-between items-center shadow-sm select-none">
              <div className="flex items-center gap-3">
                <PLNLogo className="h-9 w-auto" />
                <div>
                  <h1 className="text-base font-semibold tracking-normal flex items-center gap-2">
                    <span>MONA LISA MONITORING</span>
                    <span className="text-slate-400 font-light text-xs">|</span>
                    <span className="text-[#F2C94C] text-xs font-semibold tracking-wider">P4 AI MONITORING</span>
                  </h1>
                </div>
              </div>

              {/* Status information parameters */}
              <div className="flex items-center gap-6 text-xs">
                <div className="hidden sm:flex items-center gap-2 text-slate-300">
                  <Clock size={14} className="text-[#F2C94C]" />
                  <span className="font-sans">{currentTime} WIB</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-slate-300">
                  <span className="font-semibold text-slate-400">User:</span>
                  <span className="text-white font-medium">{currentUser.username}</span>
                </div>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded text-xs transition-colors"
                >
                  Keluar
                </button>
              </div>
            </header>

            {/* BREADCRUMB */}
            <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-2 text-xs text-slate-500">
              <span className="hover:text-[#0072CE] cursor-pointer">Home</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span>MONA LISA</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-slate-800">{activeTab}</span>
            </div>

            {/* CORE CONTENT SWITCH ROUTER */}
            <div className="p-6 flex-1 space-y-6">

              {/* TAB: DASHBOARD UTAMA */}
              {activeTab === "Dashboard Utama" && (
                <>

                  <CorporateStatusStrip
                    customers={customers}
                    queryLogs={queryLogs}
                    waChartLogs={waChartLogs}
                    errorLogs={errorLogs}
                    currentTime={currentTime}
                  />

                  {/* Clean Corporate KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_14px_40px_rgba(0,114,206,0.10)] relative overflow-hidden group monalisa-hover-lift">
                      <div className="absolute top-4 right-4 text-slate-400">
                        <MessageSquare size={16} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total Request WA</p>
                      <h3 className="text-2xl font-semibold mt-2 text-slate-900">{queryLogs.length}</h3>
                      <p className="text-[10px] text-[#10B981] flex items-center gap-1 mt-1.5 font-semibold">
                        <TrendingUp size={10} /> +12% dari kemarin
                      </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_14px_40px_rgba(0,114,206,0.10)] relative overflow-hidden group monalisa-hover-lift">
                      <div className="absolute top-4 right-4 text-slate-400">
                        <BarChart3 size={16} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Grafik WA Terkirim</p>
                      <h3 className="text-2xl font-semibold mt-2 text-slate-900">{waChartLogs.length}</h3>
                      <p className="text-[10px] text-[#10B981] flex items-center gap-1 mt-1.5 font-semibold">
                        ✓ 100% Berhasil
                      </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_14px_40px_rgba(0,114,206,0.10)] relative overflow-hidden group monalisa-hover-lift">
                      <div className="absolute top-4 right-4 text-slate-400">
                        <AlertTriangle size={16} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Data Belum Lengkap</p>
                      <h3 className="text-2xl font-semibold mt-2 text-amber-600">
                        {customers.filter(c => Object.values(c).includes(null)).length} Pelanggan
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Perlu validasi AMR segera</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_14px_40px_rgba(0,114,206,0.10)] relative overflow-hidden group monalisa-hover-lift">
                      <div className="absolute top-4 right-4 text-slate-400">
                        <Activity size={16} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Status Sistem</p>
                      <h3 className="text-lg font-semibold mt-3 text-[#10B981]">AKTIF / AMAN</h3>
                      <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Tidak ada error kritis</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_14px_40px_rgba(0,114,206,0.10)] relative overflow-hidden group monalisa-hover-lift">
                      <div className="absolute top-4 right-4 text-slate-400">
                        <Cpu size={16} />
                      </div>
                      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">AI Monitoring</p>
                      <h3 className="text-lg font-semibold mt-3 text-slate-700">ONLINE</h3>
                      <p className="text-[10px] text-slate-500 mt-1.5 font-medium">9Router AI Gateway Siaga</p>
                    </div>
                  </div>

                  {/* Primary interactive chart and customer selection */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200 gap-4 shadow-sm">
                        <span className="text-xs font-semibold text-slate-700">Pilih IDPEL untuk Menampilkan Grafik Utama:</span>
                        <select 
                          value={selectedCustomerId}
                          onChange={(e) => setSelectedCustomerId(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#00AEEF] font-semibold"
                        >
                          {customers.map(c => (
                            <option key={c.idpel} value={c.idpel}>{c.idpel} - {c.nama}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Integrated Interactive Chart */}
                      <RenderInteractiveChart customer={activeCustomer} />
                    </div>

                    {/* Integrated AI Insight - Clean light theme panel */}
                    <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)] relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#0072CE]"></div>
                      <div>
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <Cpu className="text-[#0072CE]" size={16} />
                            Insight Sistem (AI)
                          </h3>
                          {isAiLoading && <RefreshCw size={14} className="text-[#0072CE]" />}
                        </div>

                        {isAiLoading ? (
                          <div className="space-y-3 py-8">
                            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-700 leading-relaxed max-h-[300px] overflow-y-auto space-y-2 select-text bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            {aiInsightResult ? (
                              <div className="prose prose-slate prose-xs">
                                {aiInsightResult.split("\n").map((line, idx) => {
                                  if (line.startsWith("###")) {
                                    return <h4 key={idx} className="text-xs font-semibold text-slate-800 mt-3 mb-1">{line.replace("###", "")}</h4>;
                                  }
                                  if (line.startsWith("*") || line.startsWith("-")) {
                                    return <li key={idx} className="ml-4 list-disc mt-1 text-slate-600">{line.replace(/^[*\-\s]+/, "")}</li>;
                                  }
                                  return <p key={idx} className="my-1">{line}</p>;
                                })}
                              </div>
                            ) : (
                              <p className="text-slate-500">Tidak ada data insight terkini. Silakan pemicu analisis AI di bawah.</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => generateAiInsights()}
                          disabled={isAiLoading}
                          className="w-full bg-[#0072CE] hover:bg-[#005ea8] text-white py-2 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
                        >
                          <RefreshCw size={12} className="" />
                          Picu Analisis AI Real-Time
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Audit Trail List (Light theme) */}
                  <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <Database className="text-[#0072CE]" size={16} />
                        Audit Trail Log (EDIT_LOG)
                      </h3>
                      <span className="text-xs text-slate-500">Total riwayat: {editLogs.length} entri</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500">
                            <th className="pb-3">Waktu Perubahan</th>
                            <th className="pb-3">Pelaku</th>
                            <th className="pb-3">IDPEL</th>
                            <th className="pb-3">Kolom Diubah</th>
                            <th className="pb-3">Nilai Lama</th>
                            <th className="pb-3">Nilai Baru</th>
                            <th className="pb-3">Sumber</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editLogs.map((log, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 text-slate-600">
                              <td className="py-3 font-sans">{log.time}</td>
                              <td className="py-3 font-semibold text-slate-800">{log.user}</td>
                              <td className="py-3 font-sans text-[#0072CE]">{log.idpel}</td>
                              <td className="py-3 uppercase font-semibold text-slate-700">{log.field}</td>
                              <td className="py-3 font-sans text-amber-600">{log.oldVal}</td>
                              <td className="py-3 font-sans text-green-600">{log.newVal}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${log.source === 'WhatsApp' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {log.source}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* TAB: MASTER DATABASE */}
              {activeTab === "Master Database" && (
                <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                        <Database className="text-[#0072CE]" size={18} />
                        Master Database Pelanggan MONA LISA P4
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Kelola dan filter data seluruh pelanggan dengan andal.</p>
                    </div>
                    
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Cari IDPEL, Nama, atau Tarif..." 
                        value={searchIdpel}
                        onChange={(e) => setSearchIdpel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-xs"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                          <th className="pb-3">IDPEL</th>
                          <th className="pb-3">Nama Pelanggan</th>
                          <th className="pb-3">Tarif</th>
                          <th className="pb-3">Daya</th>
                          <th className="pb-3">Site Code</th>
                          <th className="pb-3">Site Name</th>
                          <th className="pb-3">Modem</th>
                          <th className="pb-3">Jan</th>
                          <th className="pb-3">Apr</th>
                          <th className="pb-3">Jul</th>
                          <th className="pb-3">Okt</th>
                          <th className="pb-3">Des</th>
                          <th className="pb-3">Status Data</th>
                          <th className="pb-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers
                          .filter(c => 
                            c.idpel.includes(searchIdpel) || 
                            c.nama.toLowerCase().includes(searchIdpel.toLowerCase()) ||
                            c.tarif.toLowerCase().includes(searchIdpel.toLowerCase())
                          )
                          .map((c) => {
                            const hasNull = Object.values(c).includes(null);
                            return (
                              <tr key={c.idpel} className="border-b border-slate-100 hover:bg-slate-50 text-slate-600">
                                <td className="py-3 font-sans text-[#0072CE] font-semibold">{c.idpel}</td>
                                <td className="py-3 font-semibold text-slate-800 max-w-[150px] truncate">{c.nama}</td>
                                <td className="py-3">{c.tarif}</td>
                                <td className="py-3 font-sans">{c.daya}</td>
                                <td className="py-3">{c.siteCode}</td>
                                <td className="py-3 truncate max-w-[120px]">{c.siteName}</td>
                                <td className="py-3 font-sans text-slate-700">{c.merkModem}</td>
                                <td className="py-3 font-sans">{c.jan ? c.jan.toLocaleString("id-ID") : "-"}</td>
                                <td className="py-3 font-sans">{c.apr ? c.apr.toLocaleString("id-ID") : "-"}</td>
                                <td className="py-3 font-sans">{c.jul ? c.jul.toLocaleString("id-ID") : "-"}</td>
                                <td className="py-3 font-sans">{c.okt ? c.okt.toLocaleString("id-ID") : "-"}</td>
                                <td className="py-3 font-sans">{c.des ? c.des.toLocaleString("id-ID") : "-"}</td>
                                <td className="py-3">
                                  {hasNull ? (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 w-max">
                                      <Info size={10} /> Data Parsial
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-green-50 text-green-800 border border-green-200 flex items-center gap-1 w-max">
                                      <CheckCircle2 size={10} /> Lengkap
                                    </span>
                                  )}
                                </td>
                                <td className="py-3">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => { setSelectedCustomerId(c.idpel); setActiveTab("Data Pelanggan"); }}
                                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded text-[10px] transition font-semibold"
                                    >
                                      Profil
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedCustomerId(c.idpel); setActiveTab("Grafik Pemakaian"); }}
                                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-[#00AEEF]/30 text-[#0072CE] rounded text-[10px] transition font-semibold"
                                    >
                                      Grafik
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: DATA PELANGGAN */}
              {activeTab === "Data Pelanggan" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column Profile info */}
                  <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)] space-y-6">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[9px] bg-slate-100 text-[#0072CE] border border-slate-200 px-2 py-1 rounded font-semibold uppercase tracking-wider">PROFIL PELANGGAN AMR</span>
                        <h2 className="text-md font-semibold mt-2 text-slate-800">{activeCustomer.nama}</h2>
                        <p className="text-xs text-slate-500 mt-1 font-sans">IDPEL: {activeCustomer.idpel}</p>
                      </div>
                      <PLNLogo className="h-10 w-auto" />
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tarif / Daya:</span>
                        <span className="font-semibold text-slate-800">{activeCustomer.tarif} / {activeCustomer.daya}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kode Site:</span>
                        <span className="font-sans text-slate-800">{activeCustomer.siteCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nama Site:</span>
                        <span className="text-slate-800 font-semibold truncate max-w-[180px]">{activeCustomer.siteName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nomor Meter:</span>
                        <span className="font-sans text-slate-800">{activeCustomer.noMeter || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Merek / Tipe Meter:</span>
                        <span className="text-slate-800">{activeCustomer.merkMeter} - {activeCustomer.typeMeter || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Merek Modem:</span>
                        <span className="text-slate-800 font-sans">{activeCustomer.merkModem || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Koordinat (TIKOR):</span>
                        <span className="text-slate-800 font-sans">{activeCustomer.tikor || "-"}</span>
                      </div>
                      <div className="flex flex-col gap-1 pt-2">
                        <span className="text-slate-500">Alamat Terdaftar:</span>
                        <span className="text-slate-700 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed">{activeCustomer.alamat}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${activeCustomer.tikor}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-center font-semibold block transition flex items-center justify-center gap-2"
                      >
                        <MapPin size={14} /> Buka di Google Maps
                      </a>
                      
                      <button 
                        onClick={() => notify(`Membuka Diagram Fasor IDPEL ${activeCustomer.idpel}`, "success")}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-center font-semibold block transition"
                      >
                        Buka Diagram Fasor AMR
                      </button>
                    </div>
                  </div>

                  {/* Right Column Monthly Load Table */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                      <h3 className="text-sm font-semibold mb-4 text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <BarChart3 className="text-[#0072CE]" size={16} />
                        Data Pemakaian Energi Bulanan (kWh) - Tahun 2026
                      </h3>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: "Januari", key: "jan" },
                          { label: "Februari", key: "feb" },
                          { label: "Maret", key: "mar" },
                          { label: "April", key: "apr" },
                          { label: "Mei", key: "mei" },
                          { label: "Juni", key: "jun" },
                          { label: "Juli", key: "jul" },
                          { label: "Agustus", key: "ags" },
                          { label: "September", key: "sep" },
                          { label: "Oktober", key: "okt" },
                          { label: "November", key: "nov" },
                          { label: "Desember", key: "des" }
                        ].map((m, idx) => {
                          const val = activeCustomer[m.key];
                          return (
                            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center relative overflow-hidden">
                              <span className="text-[9px] text-slate-500 uppercase font-semibold">{m.label}</span>
                              <p className={`text-sm font-sans mt-1 font-semibold ${val === null ? 'text-red-600' : 'text-slate-800'}`}>
                                {val !== null ? `${val.toLocaleString("id-ID")}` : "-"}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 flex flex-wrap justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 gap-4">
                        <div className="text-xs">
                          <span className="text-slate-500">Kelengkapan Berkas Data:</span>
                          <span className={`block font-semibold mt-1 ${Object.values(activeCustomer).includes(null) ? 'text-amber-600' : 'text-green-600'}`}>
                            {Object.values(activeCustomer).includes(null) ? '⚠️ Peringatan: Data Belum Lengkap' : '✓ Seluruh Data Lengkap'}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setActiveTab("Update Data"); setUpdateFormData({ ...updateFormData, idpel: activeCustomer.idpel }); }}
                            className="bg-[#0072CE] hover:bg-[#005ea8] text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                          >
                            Edit Melalui Dashboard
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Interactive Chart inside Customer Details too */}
                    <RenderInteractiveChart customer={activeCustomer} />
                  </div>
                </div>
              )}

              {/* TAB: GRAFIK PEMAKAIAN */}
              {activeTab === "Grafik Pemakaian" && (
                <div className="space-y-6">
                  <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                          <BarChart3 className="text-[#0072CE]" size={18} />
                          Visualisasi & Distribusi Grafik Pemakaian
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Picu pengiriman visualisasi grafik langsung ke WhatsApp Pelanggan.</p>
                      </div>

                      <select 
                        value={selectedCustomerId}
                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#00AEEF]"
                      >
                        {customers.map(c => (
                          <option key={c.idpel} value={c.idpel}>{c.idpel} - {c.nama}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <RenderInteractiveChart customer={activeCustomer} />
                      </div>

                      {/* WhatsApp Delivery Panel & Caption Preview (Light Standard) */}
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 border border-slate-200 px-2 py-0.5 bg-white rounded font-semibold uppercase block w-max">WHATSAPP PREVIEW</span>
                          <h3 className="text-xs font-semibold text-slate-700 mt-3 mb-2">Simulasi Caption Pesan WhatsApp</h3>
                          
                          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 font-sans space-y-3 max-h-[220px] overflow-y-auto leading-relaxed shadow-inner">
                            <p className="text-[#0072CE] font-semibold text-[10px]">PENGIRIM: MONA_LISA_BOT</p>
                            <p>
                              {systemConfig.captionFormat
                                .replace("{NAMA}", activeCustomer.nama)
                                .replace("{IDPEL}", activeCustomer.idpel)
                                .replace("{DAYA}", activeCustomer.daya)
                              }
                            </p>
                            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-[10px] text-[#0072CE] flex items-center gap-2">
                              <FileSpreadsheet size={16} /> Link: https://chart.monalisa.pln.co.id/render?idpel={activeCustomer.idpel}
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <label className="block text-[10px] text-slate-500 font-semibold uppercase mb-2 flex items-center gap-1">
                              <Cpu size={12} className="text-[#0072CE]" /> Modifikasi Pesan via 9Router AI Gateway
                            </label>
                            <div className="flex gap-2 mb-2">
                              <select
                                value={aiTone}
                                onChange={(e) => setAiTone(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-800 text-[11px] rounded-xl px-2 py-1.5 focus:outline-none flex-1 font-semibold"
                              >
                                <option value="Sopan & Formal">Sopan & Formal (SOP)</option>
                                <option value="Persuasif Tegas (Peringatan)">Tegas & Urgent (Warning)</option>
                                <option value="Apresiasi Pelanggan Setia">Ramah & Apresiatif (Loyalty)</option>
                              </select>
                              <button
                                onClick={handleAiBroadcastGenerate}
                                disabled={isAiBroadcasting}
                                className="bg-[#0072CE] hover:bg-[#005ea8] text-white font-semibold text-[11px] px-3 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0"
                              >
                                {isAiBroadcasting ? <RefreshCw size={11} className="" /> : "Buat Draf AI"}
                              </button>
                            </div>
                            {aiCustomBroadcast && (
                              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-600 font-sans space-y-1 max-h-[140px] overflow-y-auto leading-relaxed relative select-all shadow-inner">
                                <span className="text-[#0072CE] font-semibold text-[9px] block">REKOMENDASI COPYWRITING AI:</span>
                                <p className="whitespace-pre-wrap">{aiCustomBroadcast}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-200 mt-6">
                          <button 
                            onClick={() => {
                              const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
                              const msgId = `g.us:WA-GEN-${Math.floor(Math.random()*900000)+100000}`;
                              setWaChartLogs(prev => [{
                                time: nowStr,
                                idpel: activeCustomer.idpel,
                                nama: activeCustomer.nama,
                                url: `https://chart.monalisa.pln.co.id/render?idpel=${activeCustomer.idpel}`,
                                messageId: msgId,
                                status: "Sukses"
                              }, ...prev]);
                              notify(`Grafik berhasil dikirim ulang ke nomor terdaftar!`, "success");
                            }}
                            className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Send size={14} /> Kirim Ulang Grafik ke WhatsApp
                          </button>

                          <button 
                            onClick={() => notify(`Mengunduh berkas gambar Grafik_${activeCustomer.idpel}.png`, "success")}
                            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Download size={14} /> Unduh Gambar Grafik (.PNG)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: QUERY LOG WA */}
              {activeTab === "Query Log WA" && (
                <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                        <FileText className="text-[#0072CE]" size={18} />
                        Query Request Log WhatsApp
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Riwayat pesan permintaan yang diterima oleh sistem Gateway MONA LISA.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="pb-3">Waktu Request</th>
                          <th className="pb-3">Nomor WhatsApp Pengirim</th>
                          <th className="pb-3">Keyword Perintah</th>
                          <th className="pb-3">IDPEL Target</th>
                          <th className="pb-3">Status Pencarian</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queryLogs.map((log, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 text-slate-600">
                            <td className="py-3 font-sans">{log.time}</td>
                            <td className="py-3 font-sans text-slate-800">{log.sender}</td>
                            <td className="py-3 font-sans text-slate-700">{log.keyword}</td>
                            <td className="py-3 font-sans font-semibold text-slate-800">{log.idpel}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${log.status === 'Ditemukan' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: LOG GRAFIK WA */}
              {activeTab === "Log Grafik WA" && (
                <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                        <MessageSquare className="text-[#0072CE]" size={18} />
                        Log Pengiriman Grafik WhatsApp
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Daftar visualisasi grafik yang sukses di-render dan dikirim via Chat.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="pb-3">Waktu Kirim</th>
                          <th className="pb-3">IDPEL</th>
                          <th className="pb-3">Nama Pelanggan</th>
                          <th className="pb-3">Render Chart URL</th>
                          <th className="pb-3">Message ID</th>
                          <th className="pb-3">Status Distribusi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {waChartLogs.map((log, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 text-slate-600">
                            <td className="py-3 font-sans">{log.time}</td>
                            <td className="py-3 font-sans text-[#0072CE] font-semibold">{log.idpel}</td>
                            <td className="py-3 text-slate-800 font-semibold">{log.nama}</td>
                            <td className="py-3 font-sans text-slate-500 select-all truncate max-w-[200px]">{log.url}</td>
                            <td className="py-3 font-sans text-[11px] text-slate-700">{log.messageId}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-[10px] font-semibold flex items-center gap-1 w-max">
                                <CheckCircle2 size={10} /> {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: AI INSIGHT DETAILED PANEL */}
              {activeTab === "AI Insight" && (
                <div className="space-y-6">
                  <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                          <Cpu className="text-[#0072CE]" size={18} />
                          Pusat Kecerdasan AI Insight MONA LISA
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Gunakan 9Router AI Gateway untuk menghasilkan laporan analitis anomali AMR & pemakaian listrik pelanggan secara instan.</p>
                      </div>

                      <button 
                        onClick={() => generateAiInsights()}
                        disabled={isAiLoading}
                        className="bg-[#0072CE] hover:bg-[#005ea8] text-white font-semibold text-xs rounded-xl px-4 py-2.5 transition flex items-center gap-2"
                      >
                        <RefreshCw size={14} className="" />
                        Refresh Analisis AI
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[400px]">
                          {isAiLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                              <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#0072CE]"></div>
                              <p className="text-xs text-slate-600 font-semibold tracking-wider">AI sedang meninjau Database & Log Sistem...</p>
                            </div>
                          ) : (
                            <div className="text-sm text-slate-700 leading-relaxed space-y-4 select-text">
                              {aiInsightResult ? (
                                <div className="prose prose-slate max-w-none">
                                  {aiInsightResult.split("\n").map((line, idx) => {
                                    if (line.startsWith("###")) {
                                      return <h3 key={idx} className="text-sm font-semibold text-slate-800 mt-6 mb-2 border-b border-slate-200 pb-1">{line.replace("###", "")}</h3>;
                                    }
                                    if (line.startsWith("##")) {
                                      return <h2 key={idx} className="text-md font-semibold text-slate-900 mt-8 mb-3">{line.replace("##", "")}</h2>;
                                    }
                                    if (line.startsWith("*") || line.startsWith("-")) {
                                      return <li key={idx} className="ml-6 list-disc mt-2 text-slate-600">{line.replace(/^[*\-\s]+/, "")}</li>;
                                    }
                                    return <p key={idx} className="my-2">{line}</p>;
                                  })}
                                </div>
                              ) : (
                                <p className="text-slate-400 italic">Menunggu perintah analisis AI...</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Interactive Chat Console and Custom Prompt Box */}
                      <div className="space-y-6">
                        {/* Live Chatbot */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col h-[320px] justify-between shadow-sm">
                          <h3 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Tanya MONA LISA Copilot (Live)
                          </h3>
                          <div className="flex-1 overflow-y-auto space-y-3 mb-2 pr-1 text-[11px] leading-relaxed">
                            {aiChatHistory.map((item, index) => (
                              <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2.5 rounded-2xl max-w-[85%] border ${
                                  item.role === 'user' 
                                    ? 'bg-slate-100 text-slate-800 border-slate-200 rounded-tr-none' 
                                    : 'bg-blue-50 text-slate-700 border-blue-100 rounded-tl-none'
                                }`}>
                                  <p className="whitespace-pre-line">{item.text}</p>
                                </div>
                              </div>
                            ))}
                            {isAiChatLoading && (
                              <div className="flex justify-start">
                                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl rounded-tl-none text-[10px] text-slate-500 flex items-center gap-2">
                                  <RefreshCw size={11} className="" /> Sedang berpikir...
                                </div>
                              </div>
                            )}
                          </div>
                          <form onSubmit={handleAiChatSubmit} className="flex gap-2 pt-2 border-t border-slate-100">
                            <input 
                              type="text"
                              value={aiChatInput}
                              onChange={(e) => setAiChatInput(e.target.value)}
                              placeholder="Konsultasikan beban/anomali..."
                              className="flex-1 bg-slate-50 border border-slate-200 text-[11px] text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#00AEEF]"
                            />
                            <button 
                              type="submit"
                              className="bg-[#0072CE] hover:bg-[#005ea8] text-white px-3 rounded-xl flex items-center justify-center transition shrink-0"
                            >
                              <Send size={12} />
                            </button>
                          </form>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                          <h3 className="text-xs font-semibold text-slate-700 mb-2">Tanyakan hal khusus pada AI:</h3>
                          <textarea 
                            value={customAiPrompt}
                            onChange={(e) => setCustomAiPrompt(e.target.value)}
                            placeholder="Contoh: Apakah ada indikasi penurunan drastis pemakaian di Siloam Hospital? Berikan langkah taktisnya." 
                            className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-xs leading-relaxed"
                          />
                          <button 
                            onClick={() => generateAiInsights(customAiPrompt)}
                            disabled={isAiLoading || !customAiPrompt.trim()}
                            className="w-full mt-3 bg-white border border-[#00AEEF] text-[#0072CE] hover:bg-blue-50 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
                          >
                            <Cpu size={12} /> Kirim Perintah ke AI
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: WHATSAPP SIMULATOR */}
              {activeTab === "WA Simulator" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left explanation pane */}
                  <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)] space-y-4">
                    <h2 className="text-md font-semibold text-slate-800">WA Gateway Simulator</h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Gunakan panel ini untuk mensimulasikan pesan masuk dari WhatsApp operator ke mesin sistem MONA LISA. Sistem akan mengurai format pesan, memperbarui Master Database secara instan, dan mencatatnya ke log transaksi.
                    </p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                      <p className="font-semibold text-slate-700">Template Perintah yang Didukung:</p>
                      
                      <div className="space-y-2">
                        <div className="p-2 bg-white rounded border border-slate-200">
                          <code className="text-[#0072CE] block font-sans">UPDATE [IDPEL] [BULAN] [NILAI]</code>
                          <span className="text-[10px] text-slate-500">Contoh: UPDATE 141001728156 MARET 25800</span>
                        </div>

                        <div className="p-2 bg-white rounded border border-slate-200">
                          <code className="text-[#0072CE] block font-sans">UPDATE IDPEL [IDPEL] TIKOR [LAT,LONG]</code>
                          <span className="text-[10px] text-slate-500">Contoh: UPDATE IDPEL 141001728156 TIKOR -3.0182,104.7924</span>
                        </div>

                        <div className="p-2 bg-white rounded border border-slate-200">
                          <code className="text-[#0072CE] block font-sans">CEK [IDPEL]</code>
                          <span className="text-[10px] text-slate-500">Contoh: CEK 141001728156</span>
                        </div>

                        <div className="p-2 bg-white rounded border border-slate-200">
                          <code className="text-[#0072CE] block font-sans">GRAFIK [IDPEL]</code>
                          <span className="text-[10px] text-slate-500">Contoh: GRAFIK 141001728156</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Chat UI Simulator */}
                  <div className="lg:col-span-2 bg-slate-100 border border-slate-200 rounded-2xl p-6 shadow-sm h-[550px] flex flex-col justify-between">
                    {/* Simulator Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0072CE] flex items-center justify-center font-semibold text-white text-sm">ML</div>
                        <div>
                          <h3 className="text-xs font-semibold text-slate-800">MONA LISA WA Gateway</h3>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">Online • Auto-responder Active</span>
                        </div>
                      </div>
                      <PLNLogo className="h-8 w-auto" />
                    </div>

                    {/* Chat Bubble Area */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs leading-relaxed">
                      {waSimResponses.map((res, i) => (
                        <div 
                          key={i} 
                          className={`flex ${res.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`p-3 rounded-xl max-w-[80%] whitespace-pre-line border ${
                            res.role === 'user' 
                              ? 'bg-blue-600 text-white rounded-tr-none border-[#00AEEF]' 
                              : 'bg-white text-slate-700 rounded-tl-none border-slate-200'
                          }`}>
                            <span className={`block text-[8px] font-semibold mb-1 ${res.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                              {res.role === 'user' ? 'OPERATOR' : 'MONA LISA BOT'}
                            </span>
                            {res.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Box Input form */}
                    <form onSubmit={handleWaCommandSend} className="mt-4 pt-3 border-t border-slate-200 flex gap-2">
                      <input 
                        type="text"
                        value={waSimMessage}
                        onChange={(e) => setWaSimMessage(e.target.value)}
                        placeholder="Ketik perintah WhatsApp disini... (Contoh: CEK 141001728156)"
                        className="flex-1 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#0072CE]"
                      />
                      <button 
                        type="submit"
                        className="bg-[#0072CE] hover:bg-[#005ea8] text-white px-4 rounded-xl flex items-center justify-center transition"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB: UPDATE DATA */}
              {activeTab === "Update Data" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                    <h2 className="text-md font-semibold text-slate-800 flex items-center gap-2 mb-2 border-b border-slate-100 pb-3">
                      <Edit3 className="text-[#0072CE]" size={18} />
                      Update Pemakaian Pelanggan via Dashboard
                    </h2>
                    <p className="text-xs text-slate-500 mb-6">Ubah data existing pelanggan secara aman. Seluruh perubahan tercatat di EDIT_LOG sebagai audit trail.</p>

                    <form onSubmit={handleDashboardUpdateSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Pilih Pelanggan (IDPEL)</label>
                        <select 
                          value={updateFormData.idpel}
                          onChange={(e) => setUpdateFormData({ ...updateFormData, idpel: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-sm"
                          required
                        >
                          <option value="">-- Pilih IDPEL --</option>
                          {customers.map(c => (
                            <option key={c.idpel} value={c.idpel}>{c.idpel} - {c.nama}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Pilih Bulan / Kolom</label>
                          <select 
                            value={updateFormData.fieldName}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, fieldName: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-sm"
                          >
                            <option value="jan">Januari</option>
                            <option value="feb">Februari</option>
                            <option value="mar">Maret</option>
                            <option value="apr">April</option>
                            <option value="mei">Mei</option>
                            <option value="jun">Juni</option>
                            <option value="jul">Juli</option>
                            <option value="ags">Agustus</option>
                            <option value="sep">September</option>
                            <option value="okt">Oktober</option>
                            <option value="nov">November</option>
                            <option value="des">Desember</option>
                            <option value="tikor">Koordinat (TIKOR)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Nilai Baru</label>
                          <input 
                            type="text" 
                            value={updateFormData.newValue}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, newValue: e.target.value })}
                            placeholder="Nilai baru..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-sm"
                            required
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-[#0072CE] hover:bg-[#005ea8] text-white font-semibold py-2.5 rounded-xl transition"
                      >
                        Simpan Perubahan ke Database
                      </button>
                    </form>
                  </div>

                  <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                    <h3 className="text-xs font-semibold text-slate-700 mb-4 border-b border-slate-100 pb-2">Informasi Aturan Audit Trail (EDIT_LOG)</h3>
                    <div className="text-xs text-slate-500 leading-relaxed space-y-3">
                      <p>Sesuai dengan standar dokumentasi operasional P4 PLN:</p>
                      <ul className="list-disc ml-4 space-y-2">
                        <li>Semua penambahan dan pembaruan data wajib masuk ke tabel log transaksi audit untuk mencegah anomali.</li>
                        <li>Sistem otomatis mengidentifikasi identitas user, jenis modifikasi, data lama sebelum diubah, dan nilai baru.</li>
                        <li>Metode update via <strong>WhatsApp</strong> ditandai dengan label sumber khusus dibanding dashboard.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: TAMBAH DATA */}
              {activeTab === "Tambah Data" && (
                <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                  <h2 className="text-md font-semibold text-slate-800 flex items-center gap-2 mb-2 border-b border-slate-100 pb-3">
                    <PlusCircle className="text-[#0072CE]" size={18} />
                    Tambah Pelanggan Baru ke Database MONA LISA
                  </h2>
                  <p className="text-xs text-slate-500 mb-6">Gunakan formulir ini untuk menambahkan gardu/pelanggan AMR baru secara lengkap.</p>

                  <form onSubmit={handleTambahPelanggan} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">IDPEL (12 Digit Unik)</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: 141001741500" 
                          value={newCustForm.idpel}
                          onChange={(e) => setNewCustForm({...newCustForm, idpel: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-xs font-sans"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Nama Pelanggan</label>
                        <input 
                          type="text" 
                          placeholder="PT Cahaya Abadi" 
                          value={newCustForm.nama}
                          onChange={(e) => setNewCustForm({...newCustForm, nama: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-xs"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Daya Kontrak (VA)</label>
                        <input 
                          type="text" 
                          placeholder="345,000 VA" 
                          value={newCustForm.daya}
                          onChange={(e) => setNewCustForm({...newCustForm, daya: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-xs font-sans"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Tarif</label>
                        <select 
                          value={newCustForm.tarif}
                          onChange={(e) => setNewCustForm({...newCustForm, tarif: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072CE] text-xs font-semibold"
                        >
                          <option value="I3/TM">I3/TM</option>
                          <option value="I4/TT">I4/TT</option>
                          <option value="B3/TM">B3/TM</option>
                          <option value="P2/TM">P2/TM</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Kode Site</label>
                        <input 
                          type="text" 
                          placeholder="S-PLG06" 
                          value={newCustForm.siteCode}
                          onChange={(e) => setNewCustForm({...newCustForm, siteCode: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Nama Site</label>
                        <input 
                          type="text" 
                          placeholder="Penyulang Demang" 
                          value={newCustForm.siteName}
                          onChange={(e) => setNewCustForm({...newCustForm, siteName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Koordinat (TIKOR)</label>
                        <input 
                          type="text" 
                          placeholder="-2.9912,104.7832" 
                          value={newCustForm.tikor}
                          onChange={(e) => setNewCustForm({...newCustForm, tikor: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-slate-800 focus:outline-none font-sans"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-4">Input Pemakaian Bulanan Awal (kWh)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                        {["jan", "feb", "mar", "apr", "mei", "jun", "jul", "ags", "sep", "okt", "nov", "des"].map((m, idx) => (
                          <div key={idx}>
                            <label className="block text-[10px] text-slate-500 uppercase font-semibold mb-1">{m}</label>
                            <input 
                              type="number"
                              value={newCustForm[m]}
                              onChange={(e) => setNewCustForm({...newCustForm, [m]: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-slate-800 focus:outline-none font-sans text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#0072CE] hover:bg-[#005ea8] text-white font-semibold py-2.5 rounded-xl transition"
                    >
                      Daftarkan Pelanggan Baru ke Database
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: ERROR LOG */}
              {activeTab === "Error Log" && (
                <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)]">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={18} />
                        Error & Fault Log Workflow
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Daftar kejadian kegagalan fungsional pada API, koneksi, atau parsing data.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="pb-3">Waktu Kejadian</th>
                          <th className="pb-3">Nama Node / Layanan</th>
                          <th className="pb-3">Pesan Error</th>
                          <th className="pb-3">Execution ID</th>
                          <th className="pb-3">Penyebab Pokok</th>
                          <th className="pb-3">Tindakan Perbaikan</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Dukungan AI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {errorLogs.map((log, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 text-slate-600">
                            <td className="py-3 font-sans">{log.time}</td>
                            <td className="py-3 font-semibold text-slate-800">{log.node}</td>
                            <td className="py-3 text-red-600 font-sans select-all truncate max-w-[150px]">{log.message}</td>
                            <td className="py-3 font-sans text-slate-500">{log.executionId}</td>
                            <td className="py-3 text-slate-600">{log.cause}</td>
                            <td className="py-3 text-green-600 font-medium">{log.fix}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${log.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <button 
                                onClick={() => handleAiErrorTroubleshoot(log)}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-[#00AEEF]/20 text-[#0072CE] rounded-xl text-[10px] font-semibold transition flex items-center gap-1"
                              >
                                <Cpu size={10} /> Diagnosa AI
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: CONFIG & ROLES */}
              {activeTab === "Config & Roles" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Parameter Config Form */}
                  <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)] space-y-6">
                    <div>
                      <h2 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                        <Settings className="text-[#0072CE]" size={18} />
                        Konfigurasi Parameter Sistem
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Sesuaikan alur koneksi endpoint API Gateway, token autentikasi, dan caption otomatis.</p>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-2 uppercase">WhatsApp API Endpoint</label>
                        <input 
                          type="text" 
                          value={systemConfig.waEndpoint}
                          onChange={(e) => setSystemConfig({...systemConfig, waEndpoint: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-2 uppercase">API Key / Secure Token</label>
                        <input 
                          type="password" 
                          value={systemConfig.apiKey}
                          onChange={(e) => setSystemConfig({...systemConfig, apiKey: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 focus:outline-none font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-2 uppercase">Format Caption Grafik WhatsApp</label>
                        <textarea 
                          value={systemConfig.captionFormat}
                          onChange={(e) => setSystemConfig({...systemConfig, captionFormat: e.target.value})}
                          className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none font-sans leading-relaxed"
                        />
                      </div>

                      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">Aktifkan AI Smart Assistant</p>
                          <span className="text-[10px] text-slate-500">Panggilan otomatis ke model Gemini</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={systemConfig.isAiEnabled}
                          onChange={(e) => setSystemConfig({...systemConfig, isAiEnabled: e.target.checked})}
                          className="w-4 h-4 rounded accent-[#0072CE]"
                        />
                      </div>

                      <button 
                        onClick={() => notify("Konfigurasi parameter berhasil diperbarui!", "success")}
                        className="w-full bg-[#0072CE] hover:bg-[#005ea8] text-white py-2 rounded-xl font-semibold transition text-xs"
                      >
                        Simpan Konfigurasi
                      </button>
                    </div>
                  </div>

                  {/* Users and Roles Policy Info */}
                  <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)] space-y-6">
                    <div>
                      <h3 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                        <Users className="text-[#0072CE]" size={16} />
                        Manajemen Peran & Hak Akses Pengguna
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Pembatasan wewenang operasi berdasarkan peran login.</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { role: "Super Admin", desc: "Akses penuh tanpa batas terhadap seluruh basis data pelanggan, log sistem, audit trail, edit logs, penghapusan, dan pengaturan konfigurasi API.", color: "text-red-600 border-red-200" },
                        { role: "Admin", desc: "Dapat meninjau penuh dashboard utama, memantau log transaksi WA, audit log, dan melakukan ekspor laporan analisis bulanan pelanggan.", color: "text-amber-600 border-amber-200" },
                        { role: "Operator", desc: "Wewenang melakukan update data manual, memicu kirim ulang grafik via WA, serta menggunakan simulator untuk memeriksa kepatuhan data AMR gardu.", color: "text-blue-600 border-blue-200" },
                        { role: "Viewer", desc: "Akses mode baca-saja. Dirancang bagi tingkatan manajemen PLN untuk memantau grafik kumulatif dan membaca evaluasi AI Smart Assistant.", color: "text-slate-600 border-slate-200" }
                      ].map((policy, i) => (
                        <div key={i} className={`p-4 rounded-xl border bg-slate-50 space-y-1 ${policy.color}`}>
                          <span className="text-xs font-semibold uppercase">{policy.role}</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{policy.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: BUKU PANDUAN */}
              {activeTab === "Buku Panduan" && (
                <div className="bg-white/82 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_14px_40px_rgba(0,114,206,0.10)] space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
                    <div>
                      <span className="text-[9px] bg-slate-100 text-[#0072CE] border border-slate-200 px-2.5 py-1 rounded font-semibold uppercase tracking-normal">DOKUMEN OPERASIONAL P4</span>
                      <h2 className="text-md font-semibold mt-2 text-slate-800 flex items-center gap-2">
                        <BookOpen className="text-[#0072CE]" size={18} />
                        Buku Panduan Pelaksanaan MONA LISA P4
                      </h2>
                      <p className="text-xs text-slate-500">Manual resmi SOP pengoperasian sistem, pembacaan grafik, audit trail, dan monitoring AI.</p>
                    </div>

                    <button 
                      onClick={() => notify("Mengekspor Buku Panduan ke PDF...", "success")}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-[#0072CE] px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2"
                    >
                      <Download size={14} /> Cetak Buku Panduan (PDF)
                    </button>
                  </div>

                  {/* Complete 10-Chapter Book Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Navigation Outline left */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 h-[500px] overflow-y-auto">
                      <span className="text-[10px] uppercase text-slate-500 font-semibold block mb-2 tracking-wider px-2">Daftar Isi Buku</span>
                      {[
                        "Bab 1: Pendahuluan",
                        "Bab 2: Gambaran Umum P4",
                        "Bab 3: Desain Dashboard",
                        "Bab 4: Panduan Login",
                        "Bab 5: Membaca Dashboard",
                        "Bab 6: Membaca Grafik",
                        "Bab 7: Update & Tambah Data",
                        "Bab 8: AI Smart Assistant",
                        "Bab 9: Penanganan Error Log",
                        "Bab 10: Rangkuman & Saran"
                      ].map((ch, i) => (
                        <a 
                          key={i} 
                          href={`#ch-${i+1}`}
                          className="block text-[11px] font-semibold text-slate-600 hover:text-[#0072CE] px-3 py-1.5 rounded-xl hover:bg-white transition"
                        >
                          {ch}
                        </a>
                      ))}
                    </div>

                    {/* Book Pages Container right */}
                    <div className="lg:col-span-3 space-y-8 max-h-[500px] overflow-y-auto pr-4 select-text leading-relaxed text-xs text-slate-700">
                      
                      {/* BAB 1 */}
                      <section id="ch-1" className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Bab 1: Pendahuluan</h3>
                        <p>
                          Sistem **MONA LISA** (Monthly Load Analysis & Smart Assistant) dirancang untuk memodernisasi infrastruktur pembacaan AMR (Automatic Meter Reading) di lingkungan PT PLN (Persero). Dokumen ini berfungsi sebagai panduan taktis operasional implementasi P4 untuk memastikan data konsumsi energi tervalidasi dengan baik.
                        </p>
                      </section>

                      {/* BAB 2 */}
                      <section id="ch-2" className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Bab 2: Gambaran Umum MONA LISA P4</h3>
                        <p>
                          Pada versi P4, sistem mengkonsolidasikan empat pilar utama: API integrasi WhatsApp Gateway, dashboard pusat kendali operator, database terdistribusi AMR, serta korelasi analitik anomali berbasis model AI LLM.
                        </p>
                      </section>

                      {/* BAB 3 */}
                      <section id="ch-3" className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Bab 3: Arsitektur & Desain Dashboard</h3>
                        <p>
                          Estetika dashboard dirancang bersih, terang, dan profesional dengan warna dasar abu-abu muda untuk kegunaan jangka panjang operator, berpadu dengan aksen biru korporat PLN.
                        </p>
                      </section>

                      {/* BAB 4 */}
                      <section id="ch-4" className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Bab 4: Panduan Autentikasi Login</h3>
                        <p>
                          Setiap pengguna wajib memilih peran yang sesuai dengan hak operasinya. Autentikasi diproteksi dengan enkripsi password standar korporat.
                        </p>
                      </section>

                      {/* BAB 5 */}
                      <section id="ch-5" className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Bab 5: Panduan Membaca Dashboard Utama</h3>
                        <p>
                          Gunakan panel indikator atas untuk memeriksa jumlah request masuk, status keaktifan server WA gateway, dan jumlah sisa data pelanggan yang belum tervalidasi lengkap (parsial).
                        </p>
                      </section>

                      {/* BAB 6 */}
                      <section id="ch-6" className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Bab 6: Panduan Analisis Grafik Pemakaian</h3>
                        <p>
                          Grafik garis merepresentasikan fluktuasi konsumsi kWh pelanggan dari Januari hingga Desember. Jika data salah satu bulan berstatus null, grafik akan menampilkan penurunan tajam ke angka 0 untuk memberi peringatan visual instan.
                        </p>
                      </section>

                      {/* BAB 7 */}
                      <section id="ch-7" className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Bab 7: SOP Pembaruan & Tambah Data via WhatsApp</h3>
                        <p>
                          Gunakan format ketat di bawah ini saat mengirim pesan dari WA:
                        </p>
                        <ul className="list-disc ml-4 space-y-1 font-sans text-[#0072CE] text-[10px]">
                          <li>UPDATE [IDPEL] [BULAN] [NILAI]</li>
                          <li>UPDATE IDPEL [IDPEL] TIKOR [LAT,LONG]</li>
                        </ul>
                      </section>

                      {/* BAB 8 */}
                      <section id="ch-8" className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Bab 8: Interpretasi AI Smart Assistant</h3>
                        <p>
                          AI Smart Assistant membaca metadata log error dan pemakaian listrik untuk merumuskan tren komersial dan menyarankan penggantian modem transmisi gardu bila dijumpai putus data berkala.
                        </p>
                      </section>

                      {/* BAB 9 */}
                      <section id="ch-9" className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Bab 9: Penanganan Error Log & Troubleshooting</h3>
                        <p>
                          Jika dijumpai status kegagalan koneksi socket WhatsApp Gateway, operator wajib meninjau Error Log, memeriksa nomor Execution ID, dan merestart modul gateway pada tab Config.
                        </p>
                      </section>

                      {/* BAB 10 */}
                      <section id="ch-10" className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Bab 10: Rangkuman & Saran Pengembangan</h3>
                        <p>
                          Disarankan untuk mengintegrasikan diagram fasor interaktif real-time ke dalam profil data pelanggan pada pengembangan MONA LISA fase berikutnya guna memperkuat pengawasan komersial.
                        </p>
                      </section>

                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Institutional Bar */}
            <footer className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center text-[10px] text-slate-400 shrink-0">
              <span>© 2026 PT PLN (Persero). All Rights Reserved. MONA LISA P4 AI Dashboard.</span>
              <span className="font-semibold text-slate-500">Sistem Terintegrasi UID Palembang</span>
            </footer>

          </main>
        </div>
      )}

      {selectedErrorForAi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#0072CE]"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[9px] bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">AI FAULT DIAGNOSTICS</span>
                  <h3 className="text-sm font-semibold text-slate-800 mt-1">Troubleshooting: {selectedErrorForAi.node}</h3>
                </div>
                <button 
                  onClick={() => setSelectedErrorForAi(null)}
                  className="text-slate-400 hover:text-slate-600 font-semibold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-semibold text-red-600 font-sans mb-1">{selectedErrorForAi.message}</p>
                  <p className="text-[10px] text-slate-500">Penyebab Awal: {selectedErrorForAi.cause}</p>
                </div>

                <div className="pt-3">
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Cpu size={14} className="text-[#0072CE]" /> Solusi Diagnostik AI:
                  </h4>

                  {isAiErrorLoading ? (
                    <div className="space-y-2 py-6">
                      <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-full"></div>
                      <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 select-text font-sans text-slate-700 whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto">
                      {aiErrorFixSuggestion}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button 
                  onClick={() => handleAiErrorTroubleshoot(selectedErrorForAi)}
                  disabled={isAiErrorLoading}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <RefreshCw size={12} className="" />
                  Minta Ulang Solusi
                </button>
                <button 
                  onClick={() => setSelectedErrorForAi(null)}
                  className="px-4 py-2 bg-[#0072CE] hover:bg-[#005ea8] text-white rounded-xl text-xs font-semibold transition"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}