import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    success: "border-transparent bg-green-500 text-white hover:bg-green-600 dark:bg-green-900 dark:text-green-100",
    warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-900 dark:text-yellow-100",
    error: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    neutral: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
