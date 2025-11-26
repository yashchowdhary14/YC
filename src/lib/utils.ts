import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCompactNumber(number: number) {
    if (number < 1000) {
        return number.toString();
    }
    if (number < 1000000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    if (number < 1000000000) {
        return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
}

export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}
