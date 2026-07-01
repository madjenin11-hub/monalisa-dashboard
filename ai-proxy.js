import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const PORT = Number(process.env.AI_PROXY_PORT || 8787);
const BASE_URL = process.env.NINE_ROUTER_BASE_URL || "http://127.0.0.1:20128/v1";
const API_KEY = process.env.NINE_ROUTER_API_KEY || "";
const MODEL = process.env.NINE_ROUTER_MODEL || "mmf/mimo-auto";

function offline(reason) {
  return `### ⚠️ Analisis Offline MONA LISA

Sistem gagal memperoleh respons dari 9Router.

**Penyebab teknis:**
${reason}

**Rekomendasi:**
1. Pastikan 9Router aktif di port 20128.
2. Pastikan AI Proxy aktif di port 8787.
3. Pastikan API key di .env valid.
4. Jangan klik Refresh AI berulang kali.
5. Jika provider free terkena risk control, tunggu cooldown atau ganti model/provider.`;
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "MONA LISA AI Proxy",
    gateway: "9Router",
    baseUrl: BASE_URL,
    model: MODEL,
    hasApiKey: Boolean(API_KEY),
    time: new Date().toISOString()
  });
});

app.post("/api/ai-insight", async (req, res) => {
  try {
    const { context = "", data = {} } = req.body || {};

    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: "NINE_ROUTER_API_KEY belum terbaca.",
        insight: offline("API key 9Router belum tersedia di .env.")
      });
    }

    const prompt = `
Anda adalah MONA LISA AI Smart Assistant untuk dashboard PLN.

Analisis data pelanggan berikut secara singkat, formal, dan terstruktur.

Konteks:
${context}

Data:
${JSON.stringify(data, null, 2)}

Format jawaban:
1. Ringkasan pelanggan
2. Temuan utama
3. Potensi risiko/anomali
4. Rekomendasi tindak lanjut
5. Catatan bahwa insight bersifat pendukung
`;

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "Anda adalah asisten analisis PLN MONA LISA. Jawab dalam Bahasa Indonesia formal dan ringkas."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2
      })
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }

    if (!response.ok) {
      console.error("9Router error:", response.status, result);
      return res.status(502).json({
        success: false,
        message: "9Router gagal memproses request.",
        error: result?.error?.message || text,
        insight: offline(result?.error?.message || text)
      });
    }

    const insight = result?.choices?.[0]?.message?.content;

    if (!insight) {
      return res.status(502).json({
        success: false,
        message: "Respons 9Router tidak memiliki insight.",
        raw: result,
        insight: offline("Respons 9Router tidak memiliki field choices[0].message.content.")
      });
    }

    res.json({
      success: true,
      gateway: "9Router",
      model: MODEL,
      insight,
      raw: result
    });

  } catch (err) {
    console.error("AI Proxy error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal menghubungi 9Router.",
      error: err.message,
      insight: offline(err.message)
    });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`MONA LISA AI Proxy aktif di http://127.0.0.1:${PORT}`);
  console.log(`Gateway: ${BASE_URL}`);
  console.log(`Model: ${MODEL}`);
  console.log(`API Key terbaca: ${API_KEY ? "YA" : "TIDAK"}`);
});
