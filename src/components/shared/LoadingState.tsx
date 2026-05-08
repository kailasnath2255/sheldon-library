import OwlMascot from "./OwlMascot";

export default function LoadingState({
  message = "Sheldon is thinking…",
}: {
  message?: string;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-up">
      <div className="animate-bounce">
        <OwlMascot size={96} />
      </div>
      <p className="mt-4 font-display text-lg font-bold text-navy">{message}</p>
      <div className="mt-3 flex gap-1">
        <span className="w-2 h-2 bg-purple rounded-full animate-pulse" />
        <span className="w-2 h-2 bg-purple rounded-full animate-pulse [animation-delay:200ms]" />
        <span className="w-2 h-2 bg-purple rounded-full animate-pulse [animation-delay:400ms]" />
      </div>
      <div className="mt-8 w-full max-w-md space-y-2">
        <div className="h-3 rounded bg-navy/5 animate-pulse" />
        <div className="h-3 rounded bg-navy/5 animate-pulse w-5/6" />
        <div className="h-3 rounded bg-navy/5 animate-pulse w-4/6" />
      </div>
    </div>
  );
}
