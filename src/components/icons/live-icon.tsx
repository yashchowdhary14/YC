import { cn } from "@/lib/utils";

export function LiveIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 140 40"
      className={cn("h-6 w-auto", className)}
      fill="none"
    >
      <path
        d="M20.4,1.4H9.6c-5,0-9,4-9,9v19.2c0,5,4,9,9,9h10.8c0.8,0,1.5-0.7,1.5-1.5V2.9C21.9,2.1,21.2,1.4,20.4,1.4z"
        fill="#f00"
        stroke="#f00"
        strokeWidth="2"
      ></path>
      <path
        d="M117.8,3.2l18.4,13.7c1.7,1.3,1.7,3.8,0,5.1l-18.4,13.7c-2.3,1.7-5.5-0.1-5.5-3V6.2C112.3,3.3,115.5,1.5,117.8,3.2z"
        fill="#f00"
        stroke="#f00"
        strokeWidth="2"
      ></path>
      <path
        d="M114.7,15.9h-89C21.4,15.9,19,18.3,19,21v0c0,2.7,2.4,5.1,5.7,5.1h89c4.3,0,7.7-2.4,7.7-5.1v0C122.4,18.3,120,15.9,114.7,15.9z"
        fill="#f00"
        stroke="#f00"
        strokeWidth="2"
      ></path>
      <text
        x="30"
        y="30"
        fontFamily="sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="#000"
      >
        LIVE
      </text>
      <circle cx="68" cy="8" r="7" fill="#f00" stroke="#f00"></circle>
    </svg>
  );
}
