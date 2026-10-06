import { Metadata } from 'next'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Terms of Use | Lina House',
  description: 'Terms of Use for Lina House surf hostel and restaurant in Imsouane, Morocco. Read our terms and conditions before using our services.',
}

export default function TermsOfUsePage() {
  return (
    <>
      {/* Header Section */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center">
            Terms of Use
          </h1>
          <p className="mt-4 text-neutral-600 text-center max-w-2xl mx-auto">
            Welcome to Lina House! By using our website, you agree to these terms and conditions.
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
                Introduction
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  This Website is operated by Lina House. Throughout the site, the terms &quot;we,&quot; &quot;us,&quot; and &quot;our&quot; refer to Lina House. Lina House offers this Website, including all information, tools, and services available, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-4">
                  By visiting our Website and/or purchasing a service from us, you agree to be bound by these Terms of Use.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">2</span>
                Use of the Website
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed mb-4">
                  By accessing or using our Website, you agree to:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span>Use the Website only for lawful purposes.</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span>Not use the Website in any way that may impair its functionality or interfere with another user&apos;s ability to access it.</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span>Not attempt to gain unauthorized access to any part of the Website or related systems.</span>
                  </li>
                </ul>
                <p className="text-neutral-600 leading-relaxed">
                  We reserve the right to deny access to anyone who violates these terms or misuses the Website.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">3</span>
                Intellectual Property
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  All content on the Website, including text, images, graphics, logos, and software, is the exclusive property of Lina House or its licensors. Unauthorized use of any content on the Website is prohibited.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-4">
                  You may not reproduce, distribute, modify, or exploit any part of the Website without our prior written consent.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">4</span>
                Services Offered
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  Lina House provides hostel accommodation, surf lessons, surfboard and wetsuit rentals, restaurant services, and airport transfers (Imsouane–Taghazout–Agadir) in Imsouane, Morocco. All bookings and services are subject to availability. We reserve the right to modify or discontinue any part of the service without prior notice.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">5</span>
                Bookings and Payments
              </h2>
              <div className="pl-11">
                <div className="space-y-4">
                  <div className="bg-neutral-50 rounded-xl p-5">
                    <p className="font-medium text-neutral-900 mb-2">Booking Confirmation</p>
                    <p className="text-neutral-600 text-sm">Your booking is confirmed once payment has been received and you receive a confirmation email.</p>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-5">
                    <p className="font-medium text-neutral-900 mb-2">Cancellation Policy</p>
                    <p className="text-neutral-600 text-sm">Cancellation terms are outlined in our <a href="/refund-policy" className="text-[#1B4965] hover:underline">Refund Policy</a>, accessible on the Website or provided upon request.</p>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-5">
                    <p className="font-medium text-neutral-900 mb-2">Pricing</p>
                    <p className="text-neutral-600 text-sm">Prices listed on the Website are subject to change without prior notice.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">6</span>
                Liability Disclaimer
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Lina House makes every effort to ensure the accuracy of the information on the Website. However, we do not guarantee that all content is free from errors or omissions.
                </p>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  To the fullest extent permitted by law, Lina House will not be liable for:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span>Losses or damages resulting from the use or inability to use the Website.</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span>Injuries, accidents, or delays arising during or as a result of our services.</span>
                  </li>
                </ul>
                <div className="mt-4 bg-[#1B4965]/5 border border-[#1B4965]/20 rounded-xl p-4">
                  <p className="text-neutral-700 font-medium text-sm">
                    Users assume all risks associated with surf lessons and water activities at their own risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">7</span>
                User Conduct
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Users agree to:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span>Not submit false or misleading information.</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span>Not use the Website to distribute unsolicited promotional content or spam.</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span>Not engage in any activities that could harm Lina House&apos;s reputation or operations.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">8</span>
                Privacy Policy
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  Your use of the Website is also governed by our <a href="/privacy-policy" className="text-[#1B4965] hover:underline">Privacy Policy</a>. Please review it to understand how we handle your personal information.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">9</span>
                Termination
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  We may terminate or suspend access to the Website or our services without notice for any reason, including if you breach these Terms of Use.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">10</span>
                Governing Law
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  These Terms of Use are governed by and construed in accordance with Moroccan law. Any disputes arising out of or relating to these Terms shall be resolved in the competent courts of Morocco.
                </p>
              </div>
            </div>

            {/* Section 11 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">11</span>
                Contact Information
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed mb-4">
                  If you have any questions about these Terms of Use, please contact us at:
                </p>
                <div className="bg-neutral-50 rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#1B4965]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:contact@linahouse.com" className="text-neutral-600 hover:text-[#1B4965]">contact@linahouse.com</a>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#1B4965] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-neutral-600">N0 Route Amadel, Imsouane, Lotissement Amadel, Morocco</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 12 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">12</span>
                Changes to Terms of Use
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  We reserve the right to update or modify these Terms of Use at any time. Changes will take effect immediately upon posting on the Website.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
