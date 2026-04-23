import { CheckCircle } from "lucide-react";

export function SuccessStep() {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900">You're all set!</h2>
            <p className="text-sm text-gray-500 max-w-xs">
                Your account is created and ready. Sign in to be redirected to the dashboard...
            </p>
        </div>
    );
}