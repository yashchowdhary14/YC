import { cn } from "@/lib/utils";

export function LiveIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M16 3.81a4 4 0 0 1 5.19 5.19" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <path d="M8 3.81a4 4 0 0 0-5.19 5.19" />
      <path d="M12 22a10 10 0 0 1-10-10" />
      <path d="M2 12H1" />
      <path d="M13 12h-2" />
      <path d="M4.93 19.07l.7-.7" />
      <path d="M18.37 5.63l.7-.7" />
      <path d="M23 12h-1" />
      <path d="M12 1v1" />
      <path d="M12 23v-1" />
      <path d="M19.07 19.07l-.7-.7" />
      <path d="M4.93 4.93l.7.7" />
    </svg>
  );
}
