import { Metadata } from 'next'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | Lina House',
  description: 'Privacy Policy for Lina House surf hostel and restaurant in Imsouane, Morocco. Learn how we collect, use, and protect your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Header Section */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center">
            Privacy Policy
          </h1>
          <p className="mt-4 text-neutral-600 text-center max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we handle your personal information.
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
                Introduction and Right to Information
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  This website is owned by Lina House (hereinafter referred to as &quot;Lina House&quot;), a surf hostel and restaurant located at N0 Route Amadel, Imsouane, Lotissement Amadel, Morocco.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-4">
                  Lina House takes your privacy and personal data protection very seriously. For this reason, Lina House fully complies with the current legislation on the protection of personal data to ensure that your personal information is securely stored.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">2</span>
                Information on Data Collected through the Website
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed mb-4">
                  For the proper functioning of the website, Lina House may have access to the following data provided by the User if necessary:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span><strong>Identification Data:</strong> User&apos;s name and surname.</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span><strong>Contact Information:</strong> Email address, phone number, and postal address.</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span><strong>Location Data:</strong> User&apos;s location.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">3</span>
                Legitimacy of Data Processing by Lina House
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  Lina House processes User data through this Website on the legitimate basis of the express or explicit consent of users, for the processing of their personal data in each specific case.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-4">
                  In this sense, Lina House processes the personal data of users to facilitate the requests made by the user, as well as to send commercial communications and/or newsletters about its own services and/or offerings.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-4">
                  By accepting this Privacy Policy, the User consents to this processing. The User may withdraw consent at any time by sending a message to the following email address: <a href="mailto:contact@linahouse.com" className="text-[#1B4965] hover:underline">contact@linahouse.com</a>, without affecting the legality of the processing based on consent prior to its withdrawal.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">4</span>
                Use of Personal Data
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Lina House may collect personal data from Users through forms on its website. This personal data may be used for the following purposes:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span>The provision of services offered on the website.</span>
                  </li>
                  <li className="flex items-start gap-2 text-neutral-600">
                    <span className="text-[#1B4965] mt-1">•</span>
                    <span>Sending commercial communications to users via mail, phone, email, SMS/MMS, instant messaging, or other similar means of communication, provided that the user has consented to this purpose of personal data processing.</span>
                  </li>
                </ul>
                <p className="text-neutral-600 leading-relaxed">
                  Likewise, the User explicitly consents to the processing of their data for the purpose of customizing the services offered, as well as segmenting their data.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-4">
                  The aforementioned processing may have the purpose of both analyzing and establishing statistics to know the traffic and use of the site by Users and determining their tastes and preferences to address them with information according to their interests and location.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">5</span>
                Truthfulness of Provided Information
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  The User guarantees that the personal data provided is accurate and is responsible for communicating to Lina House any changes to it. The User is responsible for the accuracy of the data provided, and Lina House reserves the right to exclude from registered services any User who has provided false data, without prejudice to any other action applicable under the law.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-4">
                  It is recommended to exercise the utmost diligence in data protection through the use of security tools. Lina House cannot be held responsible for theft, modification, or loss of illicit data.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">6</span>
                Data Security
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  The protection of the privacy and personal data of its clients and visitors is very important to Lina House. Therefore, Lina House does everything in its power to prevent their data from being used inappropriately. Only authorized personnel can access the data of these individuals.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-4">
                  Lina House has implemented all technical means at its disposal to prevent loss, misuse, alteration, unauthorized access, and theft of data provided by the User via the Website. However, the User must be aware that security measures on the Internet are not impregnable.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">7</span>
                Questions
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  If you have any questions regarding this Privacy Policy, please contact us by sending an email to <a href="mailto:contact@linahouse.com" className="text-[#1B4965] hover:underline">contact@linahouse.com</a>.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4965]/10 text-[#1B4965] text-sm font-bold">8</span>
                Acceptance and Consent
              </h2>
              <div className="pl-11">
                <p className="text-neutral-600 leading-relaxed">
                  The User declares to have been informed of the conditions regarding the protection of personal data by accepting and consenting to the processing of these by Lina House, in the manner and for the purposes indicated in this Privacy Policy.
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
