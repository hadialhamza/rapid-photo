export function LoadingOverlay({
  message,
  showPulse = false,
}: {
  message: string;
  showPulse?: boolean;
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/70 backdrop-blur-md transition-all">
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        {showPulse && (
          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary/10 animate-ping" />
        )}
      </div>
      <p className="font-medium text-sm text-foreground animate-in fade-in duration-500 text-center px-4">
        {message}
      </p>
      <p className="text-xs text-muted mt-2">Please wait...</p>
    </div>
  );
}
