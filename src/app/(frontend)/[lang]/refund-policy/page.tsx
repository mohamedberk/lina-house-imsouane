import { Metadata } from 'next'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Refund Policy | Lina House',
  description: 'Refund Policy for Lina House surf hostel and restaurant in Imsouane, Morocco. Learn about our cancellation and refund terms.',
}

export default function RefundPolicyPage() {
  return (
    <>
      {/* Header Section */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center">
            Refund Policy
          </h1>
          <p className="mt-4 text-neutral-600 text-center max-w-2xl mx-auto">
            We value our customers and strive to provide the best possible experience. Please read our refund policy carefully before booking.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="prose prose-neutral max-w-none">

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">1</span>
                Standard Refund Terms
              </h2>
              <div className="pl-11">
                <div className="bg-neutral-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">100%</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">More than 48 hours before</p>
                      <p className="text-sm text-neutral-600">Full refund available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">50%</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Between 48 and 24 hours before</p>
                      <p className="text-sm text-neutral-600">50% refund available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">0%</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Less than 24 hours or no-show</p>
                      <p className="text-sm text-neutral-600">No refund available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">2</span>
                Last-Minute Cancellations
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  Cancellations made at the last minute (less than 24 hours before the scheduled start time) are eligible for a 50% refund only if we are notified in advance. If no notification is received, no refund will be issued.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">3</span>
                Changes to Bookings
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  We will do our best to accommodate date or time changes, subject to availability. Any changes requested less than 24 hours before the scheduled activity may be treated as a last-minute cancellation.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">4</span>
                Weather or Operational Issues
              </h2>
              <div className="pl-11">
                <div className="bg-[#1B4965]/5 border border-[#1B4965]/20 rounded-xl p-6">
                  <p className="text-neutral-700 leading-relaxed">
                    If we must cancel the activity due to bad weather or operational issues, you will be offered the choice between:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-neutral-600">
                      <svg className="w-5 h-5 text-[#1B4965]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>A <strong>full refund</strong></span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-600">
                      <svg className="w-5 h-5 text-[#1B4965]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Rescheduling</strong> at no extra cost</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">5</span>
                How to Request a Refund
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed mb-4">
                  To request a refund, please contact us via email at <a href="mailto:contact@linahouse.com" className="text-[#1B4965] hover:underline">contact@linahouse.com</a> with your booking reference and reason for cancellation.
                </p>
                <div className="bg-neutral-50 rounded-xl p-6">
                  <p className="text-neutral-700 font-medium mb-2">Processing Time</p>
                  <p className="text-neutral-600">
                    Approved refunds will be processed to your original payment method within <strong>2 business days</strong>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
