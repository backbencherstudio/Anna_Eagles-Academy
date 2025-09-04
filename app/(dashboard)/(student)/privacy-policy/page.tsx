"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function PrivacyPolicy() {
    return (
        <div className="mx-auto w-full  p-4 rounded-lg space-y-6 py-6">
            <Tabs defaultValue="privacy" className="w-full">
                <TabsList className="w-full justify-start rounded-lg bg-white p-2">
                    <TabsTrigger value="privacy" className="data-[state=active]:bg-[#0F2598]/5 cursor-pointer data-[state=active]:text-[#0F2598]">
                        Privacy Policy
                    </TabsTrigger>
                    <TabsTrigger value="terms" className="data-[state=active]:bg-[#0F2598]/5 cursor-pointer data-[state=active]:text-[#0F2598]">
                        Terms & Conditions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="privacy">
                    <div className="space-y-4 pt-2">
                        <h2 className="text-xl font-semibold">Privacy Policy</h2>
                        <p className="text-sm text-muted-foreground">
                            At The Father’s Dwelling Place, we are committed to protecting the privacy of our
                            students, parents, staff, and website visitors. This Privacy Policy outlines how we
                            collect, use, disclose, and safeguard your information in alignment with our
                            Christian values and commitment to integrity and trust.
                        </p>

                        <section className="space-y-2">
                            <h3 className="font-semibold">1. Information We Collect</h3>
                            <p className="text-sm">We may collect the following types of information:</p>
                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                <li>
                                    <span className="font-semibold">Personal Information:</span> Name, address, email,
                                    phone number, date of birth, emergency contacts, and other registration or
                                    inquiry details.
                                </li>
                                <li>
                                    <span className="font-semibold">Academic Information:</span> Enrollment data,
                                    grades, attendance, and other records relevant to student performance.
                                </li>
                                <li>
                                    <span className="font-semibold">Payment Information:</span> For tuition, donations,
                                    or program fees (collected via secure third-party platforms).
                                </li>
                                <li>
                                    <span className="font-semibold">Website Usage Data:</span> IP address, browser type,
                                    device information, and usage patterns when you visit our website.
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold">2. How We Use Your Information</h3>
                            <p className="text-sm">We use your information to:</p>
                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                <li>Provide educational services and spiritual support</li>
                                <li>Communicate with students, parents, and guardians</li>
                                <li>Manage billing and administrative operations</li>
                                <li>Ensure campus and digital safety</li>
                                <li>Improve our website and learning experiences</li>
                                <li>
                                    Send newsletters, updates, and faith-based communications (you may opt out
                                    anytime)
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold">3. Sharing and Disclosure</h3>
                            <p className="text-sm">
                                We do not sell or rent your personal data. We may share your information with:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                <li>Authorized staff and faculty members</li>
                                <li>Educational partners or service providers (only as needed)</li>
                                <li>Government or legal authorities when required by law</li>
                                <li>Emergency contacts in the case of health or safety concerns</li>
                            </ul>
                            <p className="text-sm">
                                All third parties must adhere to strict data privacy standards.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold">4. Data Security</h3>
                            <p className="text-sm">
                                We use physical, administrative, and technological safeguards to protect your
                                personal information. While no system is completely secure, we strive to protect all
                                information with prayerful diligence and best practices.
                            </p>
                        </section>
                    </div>
                </TabsContent>

                <TabsContent value="terms">
                    <div className="space-y-4 pt-2">
                        <h2 className="text-xl font-semibold">Terms & Conditions</h2>
                        <p className="text-xs text-muted-foreground">
                            Welcome to <span className="font-semibold">The Father’s Dwelling Place</span>.
                            By accessing our website or enrolling in our programs, you agree to abide by the
                            following Terms & Conditions. Please read them carefully as they outline your rights,
                            responsibilities, and our mutual expectations in alignment with our values of faith,
                            integrity, and excellence.
                        </p>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">1. Acceptance of Terms</h3>
                            <p className="text-xs">
                                By using our website, services, or participating in any of our educational programs,
                                you agree to comply with these Terms & Conditions. If you do not agree with any part,
                                you should not use our services.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">2. Faith-Based Educational Philosophy</h3>
                            <p className="text-xs">
                                We are a Christ-centered institution. Our teachings, policies, and community life
                                reflect Christian values and principles. By enrolling or participating, you
                                acknowledge and respect our spiritual foundation.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">3. User Conduct</h3>
                            <p className="text-xs">You agree to use our services responsibly and lawfully. You may not:</p>
                            <ul className="list-disc pl-6 space-y-1 text-xs">
                                <li>Post or share offensive, illegal, or inappropriate content</li>
                                <li>Disrupt school operations or website functionality</li>
                                <li>Misrepresent yourself or impersonate others</li>
                                <li>
                                    Violate any applicable laws or regulations. We reserve the right to suspend or
                                    terminate access if these terms are violated.
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">4. Enrollment and Participation</h3>
                            <p className="text-xs">
                                All students and parents/guardians must complete the appropriate enrollment forms,
                                agree to our code of conduct, and comply with attendance, payment, and academic
                                policies as communicated by the school.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">5. Intellectual Property</h3>
                            <p className="text-xs">
                                All materials on our website, including logos, curriculum, documents, videos, and
                                photos, are the property of <span className="font-semibold">The Father’s Dwelling Place</span>
                                unless otherwise stated. These may not be copied, distributed, or reused without
                                written permission.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">6. Payment Terms</h3>
                            <p className="text-xs">
                                Your privacy is important to us. Any personal information collected is handled in
                                accordance with our Privacy Policy. By using our services, you consent to such
                                collection and use.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">7. Privacy and Data Use</h3>
                            <p className="text-xs">
                                Your privacy is important to us. Any personal information collected is handled in
                                accordance with our Privacy Policy. By using our services, you consent to such
                                collection and use.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">8. Third-Party Services</h3>
                            <p className="text-xs">
                                We may link to or use third-party tools or platforms for communication, payment, or
                                learning. We are not responsible for their content, data practices, or service
                                reliability.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">9. Limitation of Liability</h3>
                            <p className="text-xs">
                                While we strive to provide accurate, nurturing, and high-quality education, we do not
                                guarantee that all information or services will be error-free or uninterrupted. We are
                                not liable for any indirect damages arising from your use of our services.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">10. Changes to Terms</h3>
                            <p className="text-xs">
                                We reserve the right to update these Terms & Conditions at any time. Changes will be
                                posted on our website with an updated effective date. Continued use of our services
                                constitutes your acceptance of the updated terms.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">11. Governing Law</h3>
                            <p className="text-xs">
                                These terms are governed by the laws of [Insert Jurisdiction/Country]. Any disputes
                                shall be resolved in accordance with local regulations and in the spirit of Christian
                                reconciliation wherever possible.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold text-sm">12. Contact Information</h3>
                            <p className="text-xs">
                                If you have any questions about these Terms & Conditions, please contact us:
                            </p>
                            <div className="text-xs">
                                <div className="font-semibold">The Father’s Dwelling Place</div>
                                <div>Email: customer@fathers.com</div>
                                <div>Phone: 025 2331 265</div>
                            </div>
                        </section>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
