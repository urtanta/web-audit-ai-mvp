return (
  <div className={`h-screen px-4 bg-gray-100 text-gray-800 flex flex-col ${!result ? "justify-center items-center" : "py-8"}`}>
    <h1 className="text-3xl font-bold mb-6 text-center">Auditoría Web</h1>

    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl justify-center">
      <input
        className="p-2 border w-full sm:w-96 rounded"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://adibidea.com"
      />
      <button
        onClick={handleAudit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        AUDITAR
      </button>
    </div>

    {progressMessage && <p className="text-blue-600 font-medium mt-4">{progressMessage}</p>}
    {error && <p className="text-red-500 font-medium mt-2">{error}</p>}

    {result && (
      <div className="mt-12 w-full px-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl">
        {/* Metadata HTML */}
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

        {/* Lighthouse scores */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">🚦 Puntuaciones Lighthouse</h2>
          <ul className="space-y-4">
            {Object.entries(result.lighthouse).map(([key, value]) => {
              const score = value as number;
              return (
                <li key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize font-medium">{key}</span>
                    <span>{(score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-4">
                    <div
                      className={`${getColor(score)} h-4 rounded`}
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    )}
  </div>
);
