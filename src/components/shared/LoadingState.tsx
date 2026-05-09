import OwlMascot from "./OwlMascot";

export default function LoadingState({
  message = "Sheldon is thinking…",
}: {
  message?: string;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-up">
      <div className="animate-float">
        <OwlMascot size={96} />
      </div>
      <p className="mt-4 font-display text-lg font-bold text-ss-ink-900 dark:text-white">
        {message}
      </p>
      <div className="mt-3 flex gap-1">
        <span className="w-2 h-2 bg-ss-orange-500 rounded-full animate-pulse" />
        <span className="w-2 h-2 bg-ss-orange-500 rounded-full animate-pulse [animation-delay:200ms]" />
        <span className="w-2 h-2 bg-ss-orange-500 rounded-full animate-pulse [animation-delay:400ms]" />
      </div>
      <div className="mt-8 w-full max-w-md space-y-2">
        <div className="h-3 rounded ss-skeleton" />
        <div className="h-3 rounded ss-skeleton w-5/6" />
        <div className="h-3 rounded ss-skeleton w-4/6" />
      </div>
    </div>
  );
}
