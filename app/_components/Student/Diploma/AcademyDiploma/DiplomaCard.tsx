import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2 } from 'lucide-react'
import React from 'react'
import { useGetSeriesWithCoursesQuery } from '@/rtk/api/users/filterSeriesList'
import { useLazyGetAcademyDiplomaCertificateQuery } from '@/rtk/api/users/diplomaCeritificateApis'
import DiplomaCompletionCertificate from './DiplomaCompletionCertificate'
import toast from 'react-hot-toast'
import ButtonSpring from '@/components/Resuable/ButtonSpring'

export default function DiplomaCard() {
    const [selectedSeriesId, setSelectedSeriesId] = React.useState<string>('all')
    const { data: seriesResponse, isLoading: isSeriesLoading } = useGetSeriesWithCoursesQuery()
    const [triggerDiploma, { isFetching: isDiplomaLoading }] = useLazyGetAcademyDiplomaCertificateQuery()
    const [diplomaData, setDiplomaData] = React.useState<import('@/rtk/api/users/diplomaCeritificateApis').DiplomaCertificateResponse['data'] | null>(null)

    const handleDownloadDiploma = async () => {
        if (selectedSeriesId === 'all') {
            toast.error('Please select a series first')
            return
        }
        const t = toast.loading('Preparing your diploma...')
        try {
            const res = await triggerDiploma(selectedSeriesId).unwrap()
            if (!res?.success) {
                setDiplomaData(null)
                const msg = res?.message || 'Failed to get diploma data'
                toast.error(msg, { id: t })
                return
            }
            setDiplomaData(res.data)
            toast.success(res?.message || 'Diploma data retrieved successfully', { id: t })
        } catch (err: any) {
            const msg = err?.data?.error || err?.data?.message || 'Failed to get diploma data'
            toast.error(msg, { id: t })
            setDiplomaData(null)
        }
    }
    return (
        <div>
            {/* Diploma Card */}
            <Card className="mt-5 max-w-4xl mx-auto rounded-2xl py-10  ">

                <div className="flex flex-col md:flex-row items-center  justify-between px-6">

                    <div className="">
                        <h1 className="text-center text-lg xl:text-2xl  font-semibold">Academy Diploma</h1>
                    </div>
                    <Select
                        value={selectedSeriesId}
                        onValueChange={(val) => {
                            setSelectedSeriesId(val)
                        }}
                    >
                        <SelectTrigger className="w-52">
                            <SelectValue placeholder="Select Series" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Series</SelectItem>
                            {isSeriesLoading ? (
                                <SelectItem value="loading" disabled>Loading...</SelectItem>
                            ) : (
                                seriesResponse?.data?.map((series) => (
                                    <SelectItem className='cursor-pointer' key={series.id} value={series.id}>{series.title}</SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>

                </div>


                <CardContent>
                    <div className="space-y-6">
                        {/* Top info banner */}
                        <div className="rounded-lg border border-[#F1C27D] bg-amber-50 text-[#4A4C56] p-4 text-center text-sm font-medium">
                            Complete all Series and Courses in the Academy
                            <br />
                            (excluding the Special BootCamp Crash Course) to earn your official diploma.
                        </div>

                        {/* Status row */}
                        <div className="text-sm">
                            <div className="mb-2 font-medium text-[#4A4C56]">Status:</div>
                            <div className="flex items-center justify-between">
                                <div className="text-[#12B76A] dark:text-[#12B76A] font-medium">
                                    All standard courses completed
                                </div>
                                <CheckCircle2 className="size-5 text-[#12B76A]" />
                            </div>
                        </div>

                        {/* Note box */}
                        <div className="rounded-lg border bg-muted/40 p-4 text-sm leading-6">
                            <div className="mb-1 font-semibold text-[#EB3D4D]">Note:</div>
                            <p className="text-muted-foreground italic font-medium">
                                A diploma will only be generated after completing all available Series
                                and Courses in the Academy (excluding the Special BootCamp Crash Course).
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200" />

                        {/* Download button */}
                        <div className="pt-2">
                            <Button
                                disabled={selectedSeriesId === 'all' || isDiplomaLoading}
                                onClick={handleDownloadDiploma}
                                className="w-full bg-[#0F2598] hover:bg-[#0F2598]/90 py-5 cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDiplomaLoading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <ButtonSpring loading variant="spinner" size={16} color="#FFFFFF" />
                                        <span>Preparing...</span>
                                    </span>
                                ) : (
                                    'Download Diploma'
                                )}
                            </Button>
                            <div style={{
                                position: 'fixed',
                                left: '0',
                                top: '0',
                                width: '1px',
                                height: '1px',
                                overflow: 'hidden',
                                opacity: 0,
                                pointerEvents: 'none',
                                zIndex: -9999
                            }}>
                                {diplomaData ? (
                                    <DiplomaCompletionCertificate key={diplomaData.diploma_id} diploma={diplomaData} />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
