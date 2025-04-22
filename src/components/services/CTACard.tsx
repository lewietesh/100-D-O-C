'use client'

export default function CTACard() {
  return (
    <div className="bg-indigo-600 text-white rounded-lg p-6 shadow-lg space-y-3">
      <h3 className="text-xl font-bold">Grow Your Business</h3>
      <p>We help you scale with expert insight, tools, and digital solutions. Let’s talk about your goals.</p>
      <a href="#contact" className="inline-block mt-2 px-4 py-2 bg-white text-indigo-600 font-semibold rounded hover:bg-gray-100">
        Contact Us →
      </a>
    </div>
  )
}