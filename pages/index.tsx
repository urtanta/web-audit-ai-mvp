import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    setLoading(true);
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Escribe la URL que vamos a auditar</h1>
      <input
        className="p-2 border w-full max-w-md"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Introduce la URL"
      />
      <button
        onClick={handleAudit}
        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Auditar
      </button>

      {loading && <p className="mt-4">Analizando...</p>}

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Resultado:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
