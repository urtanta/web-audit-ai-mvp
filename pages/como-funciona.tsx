import Link from "next/link";

export default function ComoFunciona() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">🚀 ¿Cómo funciona?</h1>

      <p className="mb-6 text-lg">
        Esta herramienta realiza una auditoría rápida y automatizada de cualquier sitio web que le indiques. Analiza diferentes aspectos clave para mejorar el rendimiento, SEO y accesibilidad de tu web.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Paso 1 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">1. Introduce tu URL</h2>
          <p>Ve a la <Link href="/" className="text-blue-600 underline">página principal</Link> e introduce la URL del sitio web que quieres analizar.</p>
        </div>

        {/* Paso 2 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">2. Análisis automático</h2>
          <p>La herramienta utiliza <strong>Puppeteer</strong>, <strong>Lighthouse</strong> y <strong>Cheerio</strong> para analizar tu web como si fuera un navegador real.</p>
        </div>

        {/* Paso 3 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">3. Informe detallado</h2>
          <p>Obtienes un informe con los resultados clave de tu página: título, descripción, etiquetas, y puntuaciones de rendimiento y SEO.</p>
        </div>

        {/* Paso 4 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">4. Mejora tu web</h2>
          <p>Usa las recomendaciones para optimizar tu sitio web y mejorar su visibilidad en buscadores como Google.</p>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg">
          🚀 Probar ahora
        </Link>
      </div>
    </div>
  );
}

