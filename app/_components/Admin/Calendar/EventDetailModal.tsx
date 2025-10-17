'use client'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar as CalendarIcon, Clock, User, BookOpen, FileText, HelpCircle, ClipboardList, ExternalLink, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { CalendarEvent } from '@/rtk/slices/admin/calendarSehedulesSlice'

interface EventDetailModalProps {
    event: CalendarEvent;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
}

const TYPE_CONFIG = {
    CLASS: { label: 'Class', icon: BookOpen },
    QUIZ: { label: 'Quiz', icon: HelpCircle },
    ASSIGNMENT: { label: 'Assignment', icon: FileText },
    GENERAL: { label: 'General', icon: ClipboardList },
    LECTURE: { label: 'Lecture', icon: BookOpen },
    MEETING: { label: 'Meeting', icon: Users },
};

const STATUS_LABEL: Record<string, string> = {
    SCHEDULED: 'Scheduled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    IN_PROGRESS: 'In Progress',
};

const STATUS_STYLE: Record<string, string> = {
    SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-100',
    COMPLETED: 'bg-green-50 text-green-700 border-green-100',
    CANCELLED: 'bg-red-50 text-red-700 border-red-100',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-100',
};

// Shimmer loading component
const ShimmerBox = ({ className = '' }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const ShimmerText = ({ lines = 1, className = '' }: { lines?: number; className?: string }) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <ShimmerBox key={i} className="h-4 w-full" />
        ))}
    </div>
);

export default function EventDetailModal({ event, isOpen, onClose, isLoading = false }: EventDetailModalProps) {
    const typeConfig = TYPE_CONFIG[event.type] || TYPE_CONFIG.GENERAL;
    const statusLabel = STATUS_LABEL[event.status] || STATUS_LABEL.SCHEDULED;

    // Local timezone formatting
    const viewerTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const eventTz = event.timezone || viewerTz;
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: viewerTz,
    });
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true, timeZone: viewerTz,
    });

    const start = new Date(event.start_at);
    const rawEnd = new Date(event.end_at);
    const end = rawEnd < start ? new Date(start.getTime() + 60 * 60 * 1000) : rawEnd;

    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.max(1, Math.round(durationMs / (60 * 1000)));
    const durationLabel = durationMinutes >= 60
        ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 ? `${durationMinutes % 60}m` : ''}`.trim()
        : `${durationMinutes}m`;

    const now = new Date();
    const isUpcoming = start.getTime() > now.getTime();
    const timeUntilMs = start.getTime() - now.getTime();
    const timeUntilLabel = isUpcoming
        ? (() => {
            const mins = Math.round(timeUntilMs / 60000);
            if (mins < 60) return `${mins} min`;
            const hrs = Math.floor(mins / 60);
            const rem = mins % 60;
            return `${hrs}h${rem ? ` ${rem}m` : ''}`;
        })()
        : null;

    const startDateStr = dateFormatter.format(start);
    const endDateStr = dateFormatter.format(end);
    const startTimeStr = timeFormatter.format(start);
    const endTimeStr = timeFormatter.format(end);

    const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-gray-500">{icon}</div>
            <div className="flex-1">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );

    const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${className}`}>{children}</span>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>Event Details</DialogTitle>
                </DialogHeader>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                        <typeConfig.icon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1 min-w-0">
                            {isLoading ? (
                                <ShimmerBox className="h-6 w-3/4 mb-2" />
                            ) : (
                                <h2 className="text-xl font-semibold text-gray-900 truncate" title={event.title}>{event.title}</h2>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <ShimmerBox className="h-6 w-16" />
                                        <ShimmerBox className="h-6 w-20" />
                                        <ShimmerBox className="h-6 w-12" />
                                        <ShimmerBox className="h-6 w-24" />
                                    </>
                                ) : (
                                    <>
                                        <Badge className="border-gray-200 bg-white text-gray-700">{typeConfig.label}</Badge>
                                        <Badge className={STATUS_STYLE[event.status] || 'border-gray-200 bg-white text-gray-700'}>{statusLabel}</Badge>
                                        <Badge className="border-purple-100 bg-purple-50 text-purple-700">{durationLabel}</Badge>
                                        <Badge className="border-gray-200 bg-white text-gray-700">{viewerTz} (Local)</Badge>
                                        {eventTz !== viewerTz && (
                                            <Badge className="border-gray-200 bg-white text-gray-700">{eventTz} (Event)</Badge>
                                        )}
                                        {isUpcoming && (
                                            <Badge className="border-emerald-100 bg-emerald-50 text-emerald-700">Starts in {timeUntilLabel}</Badge>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-6">
                    {/* Description */}
                    {isLoading ? (
                        <div>
                            <ShimmerBox className="h-4 w-24 mb-2" />
                            <ShimmerText lines={3} />
                        </div>
                    ) : (
                        event.description && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                                <p className="text-sm text-gray-700 leading-6">{event.description}</p>
                            </div>
                        )
                    )}

                    {/* Schedule */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Schedule</h3>
                        <p className="text-xs text-gray-500 mb-2">Times shown in your local timezone ({viewerTz})</p>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-start gap-3">
                                        <ShimmerBox className="h-4 w-4 mt-0.5" />
                                        <div className="flex-1">
                                            <ShimmerBox className="h-3 w-12 mb-1" />
                                            <ShimmerBox className="h-4 w-32" />
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-start gap-3">
                                        <ShimmerBox className="h-4 w-4 mt-0.5" />
                                        <div className="flex-1">
                                            <ShimmerBox className="h-3 w-12 mb-1" />
                                            <ShimmerBox className="h-4 w-32" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-lg border border-gray-200 p-3">
                                    <InfoRow icon={<CalendarIcon className="h-4 w-4" />} label="Start" value={<span>{startDateStr} • {startTimeStr}</span>} />
                                </div>
                                <div className="rounded-lg border border-gray-200 p-3">
                                    <InfoRow icon={<Clock className="h-4 w-4" />} label="End" value={<span>{endDateStr} • {endTimeStr}</span>} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Class Link */}
                    {event.class_link && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Class Link</h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    asChild
                                    size="sm"
                                    className="h-8 px-3"
                                >
                                    <a
                                        href={event.class_link.startsWith('http') ? event.class_link : `https://${event.class_link}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Open Link
                                    </a>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3"
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(event.class_link || '');
                                            toast.success('Link copied');
                                        } catch (e) {
                                            // no-op
                                        }
                                    }}
                                >
                                    Copy Link
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Related Information */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Related</h3>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-start gap-3">
                                        <ShimmerBox className="h-4 w-4 mt-0.5" />
                                        <div className="flex-1">
                                            <ShimmerBox className="h-3 w-16 mb-1" />
                                            <ShimmerBox className="h-4 w-24" />
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-gray-200 p-3">
                                    <div className="flex items-start gap-3">
                                        <ShimmerBox className="h-4 w-4 mt-0.5" />
                                        <div className="flex-1">
                                            <ShimmerBox className="h-3 w-16 mb-1" />
                                            <ShimmerBox className="h-4 w-24" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {event.user && (
                                    <div className="rounded-lg border border-gray-200 p-3">
                                        <InfoRow icon={<User className="h-4 w-4" />} label="Instructor" value={
                                            <span>
                                                {event.user.first_name} {event.user.last_name}
                                                <span className="block text-xs text-gray-500">{event.user.email}</span>
                                            </span>
                                        } />
                                    </div>
                                )}

                                {event.course && (
                                    <div className="rounded-lg border border-gray-200 p-3">
                                        <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Course" value={event.course.title} />
                                    </div>
                                )}

                                {event.series && (
                                    <div className="rounded-lg border border-gray-200 p-3">
                                        <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Series" value={event.series.title} />
                                    </div>
                                )}

                                {event.quiz && (
                                    <div className="rounded-lg border border-gray-200 p-3">
                                        <InfoRow icon={<HelpCircle className="h-4 w-4" />} label="Quiz" value={event.quiz.title} />
                                    </div>
                                )}

                                {event.assignment && (
                                    <div className="rounded-lg border border-gray-200 p-3">
                                        <InfoRow icon={<FileText className="h-4 w-4" />} label="Assignment" value={event.assignment.title} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    {event.metadata && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Additional Information</h3>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                    {JSON.stringify(event.metadata, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
