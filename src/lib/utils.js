import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const errorMessage = (error, fallback = "An error occurred") => {
  return (
    error?.response?.data?.exceptionMsg ||
    error?.response?.data?.message ||
    error?.response?.data?.text() ||
    error?.message ||
    fallback
  );
};

export const refinedSearchParams = (searchParams) => {
  const refinedSearchParams = (obj) =>
    Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => {
          // Trim whitespace if value is a string
          if (typeof value === "string") {
            value = value.trim();
          }
          return [key, value];
        })
        .filter(
          (entry) =>
            entry[1] !== "" && entry[1] !== null && entry[1] !== undefined
        )
        .map(([key, value]) => {
          // If value matches YYYY-MM-DD format, convert to ISO string
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return [key, new Date(value).toISOString()];
          }
          return [key, value];
        })
    );

  return JSON.stringify(refinedSearchParams(searchParams));
};
