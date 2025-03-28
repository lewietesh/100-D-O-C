'use client'

export default function BrochureCard() {
  return (
    <div className="bg-white shadow rounded-lg p-6 border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Brochures</h3>
      <div className="space-y-2 text-sm text-gray-700">
        <a
          href="/docs/brochure.pdf"
          download
          className="block w-full border px-4 py-2 rounded bg-yellow-100 hover:bg-yellow-200 font-medium"
        >
          📁 DOWNLOAD.PDF
        </a>
        <a
          href="/docs/brochure.txt"
          download
          className="block w-full border px-4 py-2 rounded bg-yellow-100 hover:bg-yellow-200 font-medium"
        >
          📄 DOWNLOAD.TXT
        </a>
      </div>
    </div>
  )
}
