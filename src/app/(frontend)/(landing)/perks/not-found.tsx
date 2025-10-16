import Link from "next/link";
import { WireframeNavbar } from "@/components/wireframes";

export default function PerksNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <WireframeNavbar />

      <div className="p-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            404 - Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {` The perk or category you're looking for doesn't exist or may have
            been removed.`}
          </p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/perks"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse All Perks
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Return Home
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              If you think this is an error, please contact our support team.
            </p>
          </div>
        </div>

        {/* Suggestions */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">
            You might be interested in:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 p-4 rounded">
              <h3 className="font-medium mb-2">Popular Categories</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/perks" className="text-blue-600 hover:underline">
                    All Perks
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500">
                    Browse by category when available
                  </span>
                </li>
              </ul>
            </div>
            <div className="border border-gray-300 p-4 rounded">
              <h3 className="font-medium mb-2">Help & Support</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/faq" className="text-blue-600 hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-blue-600 hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
