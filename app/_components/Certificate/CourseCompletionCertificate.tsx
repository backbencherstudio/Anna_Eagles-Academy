'use client'
import React, { useRef, useEffect } from 'react'
import NextImage from 'next/image'
import { toPng } from 'html-to-image'
import { useAppSelector } from '@/rtk/hooks'
import type { CourseCertificate, SingleCertificateResponse } from '@/rtk/api/users/diplomaCeritificateApis'
import { jsPDF } from 'jspdf'
import watermark from '@/public/images/logo/watermark.png'
import logoo from '@/public/images/logo/logoo.png'

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

                // Wait for render
                await new Promise(resolve => setTimeout(resolve, 800))

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

        const timer = setTimeout(handleDownload, 100)
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
                backgroundColor: '#FAFAFA',
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
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
                boxShadow: 'inset 0 0 60px rgba(212, 175, 55, 0.08)'
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
                    backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(212, 175, 55, 0.1) 2px,
            rgba(212, 175, 55, 0.1) 4px
          )`,
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
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.1) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                    pointerEvents: 'none',
                    zIndex: 1
                }}></div>

                {/* Layer 3: Centered Watermark Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${watermark.src})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: '70%',
                    opacity: 5,
                    pointerEvents: 'none',
                    zIndex: 2,
                    mixBlendMode: 'normal',
                    filter: 'contrast(1.1) brightness(1.05)',
                    transform: 'rotate(-45deg)',
                    transformOrigin: 'center'
                }}></div>


                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '10%',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotate(15deg)',
                    pointerEvents: 'none',
                    zIndex: 1
                }}>
                    {/* Outer ring */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '2px solid rgba(15, 37, 152, 0.35)',
                        boxShadow: '0 3px 8px rgba(15, 37, 152, 0.08)'
                    }}></div>
                    {/* Inner decorative circle */}
                    <div style={{
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        borderRadius: '50%',
                        border: '1px solid rgba(15, 37, 152, 0.15)',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 50%, transparent 100%)'
                    }}></div>
                    {/* Text container */}
                    <div style={{
                        position: 'relative',
                        zIndex: 3,
                        textAlign: 'center',
                        lineHeight: '1.3',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'rgba(15, 37, 152, 0.45)',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase'
                    }}>
                        <div style={{
                            fontSize: '13px',
                            marginBottom: '3px',
                            color: 'rgba(15, 37, 152, 0.5)',
                            textShadow: '0 1px 0 rgba(255,255,255,0.6)'
                        }}>✓ VERIFIED</div>
                        <div style={{
                            fontSize: '10px',
                            color: 'rgba(15, 37, 152, 0.4)',
                            textShadow: '0 1px 0 rgba(255,255,255,0.5)'
                        }}>CERTIFICATE</div>
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
                                border: '4px solid #0F2598',
                                boxShadow: '0 4px 20px rgba(15, 37, 152, 0.3)'
                            }}></div>

                            {/* Inner Ring with Gradient */}
                            <div style={{
                                position: 'absolute',
                                width: '85%',
                                height: '85%',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0F2598 0%, #1E40AF 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.2)'
                            }}>
                                {/* Academy Logo Image (replacing letter W) */}
                                <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                                    <NextImage src={logoo} alt="logo" fill style={{ objectFit: 'contain' }} />
                                </div>
                            </div>

                            {/* Decorative Dots */}
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '12px',
                                width: '8px',
                                height: '8px',
                                background: '#0F2598',
                                borderRadius: '50%',
                                boxShadow: '0 0 4px rgba(15, 37, 152, 0.5)'
                            }}></div>
                            <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '12px',
                                width: '8px',
                                height: '8px',
                                background: '#0F2598',
                                borderRadius: '50%',
                                boxShadow: '0 0 4px rgba(15, 37, 152, 0.5)'
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

