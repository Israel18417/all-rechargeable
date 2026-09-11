import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="text-6xl mb-6">⚡</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 mb-6">
          Powering Up Nigeria, <br />
          One Home at a Time
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          At All Rechargeable+, we believe that everyone deserves reliable access to power. 
          We provide high-quality, durable rechargeable products to keep your life moving, even when the grid goes down.
        </p>
      </div>

      {/* Story */}
      <div className="bg-purple-50 rounded-3xl p-8 md:p-12 mb-16 border border-purple-100">
        <h2 className="text-3xl font-bold text-purple-800 mb-6">Our Story</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
          <p>
            The idea for <strong>All Rechargeable+</strong> was born out of a simple necessity. We understood the daily struggles faced by millions of Nigerians due to unpredictable power supply. From students trying to study at night, to small businesses trying to keep their doors open—lack of power is a barrier to progress.
          </p>
          <p>
            We set out to create a single destination where you could find tested, trusted, and long-lasting rechargeable solutions. No more buying fake products that spoil after a week. No more wasting money on batteries that don't last.
          </p>
          <p>
            Today, we are proud to offer a curated selection of premium rechargeable fans, bulbs, torches, and power banks. Every item in our catalog is rigorously tested to ensure it meets our high standards for durability and battery life.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-10">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '⭐', title: 'Quality First', desc: 'We never compromise on quality. If it doesn\'t pass our strict battery and durability tests, we don\'t sell it.' },
            { icon: '🤝', title: 'Customer Trust', desc: 'We believe in honest marketing. The battery life we advertise is the battery life you get.' },
            { icon: '🚚', title: 'Reliability', desc: 'From our fast delivery network to our responsive WhatsApp support, you can always count on us.' },
          ].map(value => (
            <div key={value.title} className="bg-white rounded-2xl p-6 border-2 border-purple-100 text-center hover:border-purple-300 hover:shadow-md transition-all">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-purple-700 mb-3">{value.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }} className="rounded-3xl p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
        <p className="text-purple-200 mb-8 max-w-xl mx-auto text-lg">
          Join thousands of satisfied customers who have upgraded their power setup with All Rechargeable+.
        </p>
        <Link
          href="/products"
          className="inline-block bg-yellow-400 text-purple-900 font-bold px-10 py-4 rounded-full text-lg hover:bg-yellow-300 transition-all shadow-lg"
        >
          Explore Our Products
        </Link>
      </div>
    </div>
  );
}
