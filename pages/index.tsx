import { useState } from "react";

interface LighthouseScores {
  performance: number;
  seo: number;
  accessibility: number;
}

interface AuditResult {
  result: {
    title: string;
    h1: string;
    metaDesc: string;
    robotsMeta: string;
    robotsTxt: string;
  };
  lighthouse: LighthouseScores;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  const handleAudit = async () => {
    if (!url || !url.startsWith("http")) {
      setError("Por favor, introduce una URL válida (que empiece por http).");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error desconocido");
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Auditoría Web Automática</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          className="p-2 border w-full sm:w-96 rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://ejemplo.com"
        />
        <button
          onClick={handleAudit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Auditar
        </button>
      </div>

      {loading && <p className="text-blue-600 font-medium">🔍 Analizando...</p>}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloque 1: Info básica del HTML */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">🧠 Metadata HTML</h2>
            <p><strong>Título:</strong> {result.result.title}</p>
            <p><strong>H1:</strong> {result.result.h1}</p>
            <p><strong>Meta descripción:</strong> {result.result.metaDesc}</p>
            <p><strong>Meta robots:</strong> {result.result.robotsMeta}</p>
            <p><strong>robots.txt:</strong></p>
            <pre className="text-sm bg-gray-100 p-2 mt-2 rounded overflow-auto max-h-48">
              {result.result.robotsTxt}
            </pre>
          </div>

          {/* Bloque 2: Resultados Lighthouse */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">🚦 Puntuaciones Lighthouse</h2>
            <ul className="space-y-2">
              {Object.entries(result.lighthouse).map(([key, value]) => {
                const score = value as number;
                return (
                  <li key={key} className="flex justify-between">
                    <span className="capitalize">{key}</span>
                    <span className="font-bold">{(score * 100).toFixed(0)} / 100</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
