'use client'
import React, { useRef, useEffect } from 'react'
import NextImage from 'next/image'
import { toPng } from 'html-to-image'
import { useAppSelector } from '@/rtk/hooks'
import type { CourseCertificate, SingleCertificateResponse } from '@/rtk/api/users/diplomaCeritificateApis'
import { jsPDF } from 'jspdf'
import watermark from '@/public/images/logo/withoutbg.png'
// import logoo from '@/public/images/logo/logoo.png'
import badge from '@/public/images/logo/badge1.png'
import { LiaCrownSolid } from "react-icons/lia";

interface CourseCompletionCertificateProps {
    course: CourseCertificate | SingleCertificateResponse['data']
}

export default function CourseCompletionCertificate({ course }: CourseCompletionCertificateProps) {
    const certificateRef = useRef<HTMLDivElement>(null)
    const user = useAppSelector((state) => state.auth.user)


    useEffect(() => {
        const handleDownload = async () => {
            try {
                if (!certificateRef.current) {
                    console.error('Certificate ref is null')
                    return
                }

                const element = certificateRef.current

                // Make element fully visible for capture
                element.style.setProperty('position', 'fixed', 'important')
                element.style.setProperty('top', '0', 'important')
                element.style.setProperty('left', '0', 'important')
                element.style.setProperty('width', '1200px', 'important')
                element.style.setProperty('height', 'auto', 'important')
                element.style.setProperty('z-index', '99999', 'important')
                element.style.setProperty('opacity', '1', 'important')
                element.style.setProperty('pointer-events', 'none', 'important')
                element.style.setProperty('background-color', '#FFFFFF', 'important')
                element.style.setProperty('overflow', 'visible', 'important')

                // Wait for images to fully load
                const images = element.querySelectorAll('img')
                const imageLoadPromises = Array.from(images).map((img) => {
                    if (img.complete && img.naturalHeight !== 0) return Promise.resolve()
                    return new Promise((resolve) => {
                        const timeout = setTimeout(() => resolve(null), 3000)
                        const cleanup = () => {
                            clearTimeout(timeout)
                            img.removeEventListener('load', handleLoad)
                            img.removeEventListener('error', handleError)
                        }
                        const handleLoad = () => {
                            cleanup()
                            resolve(null)
                        }
                        const handleError = () => {
                            cleanup()
                            resolve(null)
                        }
                        img.addEventListener('load', handleLoad)
                        img.addEventListener('error', handleError)
                    })
                })

                await Promise.all(imageLoadPromises)
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Generate image using html-to-image with exact rendered height
                const rect = element.getBoundingClientRect()
                const targetWidth = 1200
                const targetHeight = Math.round(rect.height)

                const dataUrl = await toPng(element, {
                    quality: 1.0,
                    pixelRatio: 2,
                    backgroundColor: '#FFFFFF',
                    cacheBust: true,
                    width: targetWidth,
                    height: targetHeight,
                })

                // Get image dimensions
                const img = new window.Image()
                img.src = dataUrl

                await new Promise((resolve) => {
                    img.onload = () => {
                        // Create PDF with custom dimensions matching the certificate
                        // Convert pixels to points (1px = 0.75pt for 96 DPI)
                        const imgWidthPt = img.width * 0.75
                        const imgHeightPt = img.height * 0.75

                        // Create PDF with custom size
                        const pdf = new jsPDF({
                            orientation: imgWidthPt > imgHeightPt ? 'landscape' : 'portrait',
                            unit: 'pt',
                            format: [imgWidthPt, imgHeightPt]
                        })

                        // Add image to PDF at full size
                        pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidthPt, imgHeightPt)

                        // Hide element immediately after starting download
                        element.style.setProperty('opacity', '0', 'important')
                        element.style.setProperty('left', '-20000px', 'important')

                        // Download PDF
                        const fileName = `${course.course_title.replace(/[^a-z0-9]+/gi, '_')}_Certificate.pdf`
                        pdf.save(fileName)

                        resolve(null)
                    }
                })
            } catch (error) {
                console.error('Error downloading certificate:', error)
            }
        }

        const timer = setTimeout(handleDownload, 300)
        return () => clearTimeout(timer)
    }, [course])

    return (
        <div
            ref={certificateRef}
            style={{
                position: 'fixed',
                top: '0',
                left: '-20000px',
                width: '1200px',
                height: 'auto',
                backgroundColor: '#FFFFFF',
                padding: '30px',
                fontFamily: '"Georgia", "Times New Roman", serif',
                color: '#000000',
            }}
        >
            {/* Outer Border */}
            <div style={{
                border: '6px solid #D4AF37',
                borderRadius: '8px',
                padding: '0',
                position: 'relative',
                background: '#FFFFFF',
                boxShadow: 'inset 0 0 60px rgba(15, 37, 152, 0.08)'
            }}>
                {/* Corner Ornaments */}
                <div style={{
                    position: 'absolute',
                    top: '-3px',
                    left: '-3px',
                    width: '50px',
                    height: '50px',
                    borderTop: '6px solid #D4AF37',
                    borderLeft: '6px solid #D4AF37',
                    borderTopLeftRadius: '8px',
                    zIndex: 3
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '50px',
                    height: '50px',
                    borderTop: '6px solid #D4AF37',
                    borderRight: '6px solid #D4AF37',
                    borderTopRightRadius: '8px',
                    zIndex: 3
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '-3px',
                    left: '-3px',
                    width: '50px',
                    height: '50px',
                    borderBottom: '6px solid #D4AF37',
                    borderLeft: '6px solid #D4AF37',
                    borderBottomLeftRadius: '8px',
                    zIndex: 3
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '-3px',
                    right: '-3px',
                    width: '50px',
                    height: '50px',
                    borderBottom: '6px solid #D4AF37',
                    borderRight: '6px solid #D4AF37',
                    borderBottomRightRadius: '8px',
                    zIndex: 3
                }}></div>

                {/* Smart Multi-Layer Watermark System */}
                {/* Layer 1: Diagonal Stripes */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    //             backgroundImage: `repeating-linear-gradient(
                    //     45deg,
                    //     #FFFFFF,
                    //     #FFFFFF 2px,
                    //     rgba(15, 37, 152, 0.08) 2px,
                    //     rgba(15, 37, 152, 0.08) 4px
                    //   )`,
                    pointerEvents: 'none',
                    zIndex: 1
                }}></div>

                {/* Layer 2: Subtle Pattern Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(15, 37, 152, 0.08) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                    pointerEvents: 'none',
                    zIndex: 1
                }}></div>

                {/* Layer 3: Centered logo Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${watermark.src})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: '60%',
                    opacity: 0.70,
                    pointerEvents: 'none',
                    zIndex: 2,
                    mixBlendMode: 'normal',
                    filter: 'contrast(1.1) brightness(1.05)'
                }}></div>



                {/* Badge */}
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '10%',
                    width: '180px',
                    height: '180px',
                    pointerEvents: 'none',
                    zIndex: 1
                }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%'
                    }}>
                        <NextImage
                            src={badge}
                            alt="Badge"
                            fill
                            style={{ objectFit: 'contain', objectPosition: 'center' }}
                            priority
                            sizes="180px"
                            quality={100}
                            unoptimized
                        />
                    </div>
                </div>

                {/* Main Certificate Content */}
                <div style={{
                    padding: '30px 50px',
                    position: 'relative',
                    zIndex: 3
                }}>
                    {/* Decorative Top Section with Emblem */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        {/* Academy Logo/Emblem Placeholder */}
                        <div style={{
                            width: '95px',
                            height: '95px',
                            margin: '0 auto 12px',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* Outer Ring */}
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: '4px solid #D4AF37',
                                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                            }}></div>

                            {/* Inner Ring with Gradient */}
                            <div style={{
                                position: 'absolute',
                                width: '85%',
                                height: '85%',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.2)',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}>
                                {/* Academy Logo Image (replacing letter W) */}
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <LiaCrownSolid className='text-white text-5xl' />
                                </div>
                            </div>

                            {/* Decorative Dots */}
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '12px',
                                width: '8px',
                                height: '8px',
                                background: '#D4AF37',
                                borderRadius: '50%',
                                boxShadow: '0 0 4px rgba(212, 175, 55, 0.5)'
                            }}></div>
                            <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '12px',
                                width: '8px',
                                height: '8px',
                                background: '#D4AF37',
                                borderRadius: '50%',
                                boxShadow: '0 0 4px rgba(212, 175, 55, 0.5)'
                            }}></div>
                        </div>

                        <div style={{
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#0F2598',
                            marginBottom: '10px',
                            letterSpacing: '2px',
                            textShadow: '1px 1px 2px rgba(15, 37, 152, 0.1)'
                        }}>
                            CERTIFICATE OF COMPLETION
                        </div>
                        <div style={{
                            fontSize: '20px',
                            color: '#64748B',
                            fontStyle: 'italic',
                            letterSpacing: '1px'
                        }}>
                            The White Eagles Academy
                        </div>

                        {/* Decorative Line */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '15px',
                            gap: '16px'
                        }}>
                            <div style={{ width: '100px', height: '2px', background: 'linear-gradient(to right, transparent, #0F2598)' }}></div>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0F2598' }}></div>
                            <div style={{ width: '100px', height: '2px', background: 'linear-gradient(to left, transparent, #0F2598)' }}></div>
                        </div>
                    </div>

                    {/* Main Content - Centerpiece */}
                    <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', color: '#475569', marginBottom: '12px', fontStyle: 'italic', letterSpacing: '1px' }}>
                            This is to certify that
                        </div>
                        <div style={{
                            fontSize: '42px',
                            fontWeight: 'bold',
                            color: '#0F2598',
                            marginBottom: '18px',
                            marginTop: '15px',
                            letterSpacing: '1px',
                            textTransform: 'capitalize',
                            textShadow: '2px 2px 4px rgba(15, 37, 152, 0.15)'
                        }}>
                            {user?.name || 'Student Name'}
                        </div>
                        <div style={{ fontSize: '18px', color: '#475569', marginBottom: '15px' }}>
                            has successfully completed
                        </div>
                        <div style={{
                            fontSize: '28px',
                            fontWeight: '600',
                            color: '#1E293B',
                            marginBottom: '20px',
                            lineHeight: '1.3',
                            fontFamily: '"Georgia", serif'
                        }}>
                            {course.course_title}
                        </div>
                    </div>

                    {/* Congratulatory Message */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '25px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            fontSize: '18px',
                            color: '#64748B',
                            fontWeight: '500',
                            fontStyle: 'italic',
                            lineHeight: '1.6'
                        }}>
                            Congratulations on completing this course successfully! This certificate recognizes your dedication, perseverance and faithfulness. May this milestone inspire you to continue to move further with the Lord.
                        </div>
                    </div>

                    {/* Issue Date */}
                    <div style={{
                        paddingTop: '8px',
                        marginTop: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            color: '#64748B',
                            fontSize: '16px',
                            marginBottom: '8px',
                            fontWeight: '600'
                        }}>
                            ISSUE DATE
                        </div>
                        <div style={{
                            fontWeight: '700',
                            fontSize: '18px',
                            color: '#0F172A'
                        }}>
                            {(() => {
                                const completionDate = 'completion_date' in course
                                    ? course.completion_date
                                    : ('course_completion_date' in course ? course.course_completion_date : null);
                                return completionDate
                                    ? new Date(completionDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : new Date().toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    });
                            })()}
                        </div>
                    </div>

                    {/* Bottom Section - Signatures */}
                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '50%', textAlign: 'center' }}>
                            <div style={{
                                textAlign: 'center',
                                // borderTop: '3px solid #0F2598',
                                paddingTop: '24px'
                            }}>
                                {/* Signature Line */}
                                <div style={{
                                    width: '200px',
                                    height: '2px',
                                    background: '#94A3B8',
                                    margin: '0 auto 12px'
                                }}></div>
                                <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '600', marginBottom: '8px' }}>
                                    Academy Director
                                </div>
                                <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                                    Signature & Seal
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer with Verification Info */}
                    <div style={{ marginTop: '25px', textAlign: 'center' }}>
                        <div style={{
                            background: 'linear-gradient(90deg, transparent, #E2E8F0, transparent)',
                            height: '1px',
                            marginBottom: '20px'
                        }}></div>
                        <div style={{
                            fontSize: '13px',
                            color: '#64748B',
                            letterSpacing: '1px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#0F2598'
                            }}></div>
                            <span>The White Eagles Academy • Verified Certificate of Achievement</span>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#0F2598'
                            }}></div>
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: '#94A3B8',
                            marginTop: '12px',
                            fontStyle: 'italic'
                        }}>
                            This certificate verifies successful course completion and can be verified through our academy records
                        </div>
                        {/* <div style={{
                            fontSize: '10px',
                            color: '#64748B',
                            marginTop: '16px',
                            letterSpacing: '0.5px',
                            fontFamily: 'monospace',
                            fontWeight: '500'
                        }}>
                            Certificate ID: {course.certificate_id || 'N/A'}
                        </div> */}
                    </div>

                </div>
            </div>
        </div>
    )
}

