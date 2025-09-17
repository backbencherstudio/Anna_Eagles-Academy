interface LoginLoadingProps {
    isLoading: boolean;
}

export default function LoginLoading({ isLoading }: LoginLoadingProps) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="relative bg-white rounded-xl p-8 flex flex-col items-center gap-6 shadow-lg">
                {/* Loading Spinner */}
                <div className="w-12 h-12 relative">
                    <div className="w-12 h-12 border-4 border-[#F1C27D]/20 border-t-[#F1C27D] rounded-full animate-spin"></div>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-1">
                    <h3 className="text-[#111827] text-lg font-medium">
                        Signing you in...
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                        Please wait a moment
                    </p>
                </div>
            </div>
        </div>
    );
}
