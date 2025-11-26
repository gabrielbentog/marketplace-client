import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-blue-100 text-blue-800", // Para status genéricos
    success: "bg-green-100 text-green-800", // Paid, Active, Completed
    warning: "bg-yellow-100 text-yellow-800", // Pending, Shipped
    error: "bg-red-100 text-red-800", // Cancelled, Inactive
    neutral: "bg-gray-100 text-gray-800", // Drafts
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}