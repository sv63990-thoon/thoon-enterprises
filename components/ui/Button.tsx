import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-indigo-950 text-white hover:bg-indigo-900 shadow-xl shadow-indigo-100/50 hover:shadow-indigo-200/50 border-none",
            secondary: "bg-amber-400 text-indigo-950 hover:bg-amber-300 shadow-lg shadow-amber-100/50 border-none",
            outline: "border-2 border-slate-200 hover:border-indigo-950 hover:text-indigo-950 hover:bg-slate-50",
            ghost: "hover:bg-slate-50 text-slate-500 hover:text-indigo-950",
        };

        const sizes = {
            sm: "h-9 px-4 text-sm",
            md: "h-11 px-6 text-base",
            lg: "h-14 px-8 text-lg",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
