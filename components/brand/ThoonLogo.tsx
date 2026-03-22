"use client";

import React from "react";
import Link from "next/link";

interface ThoonLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "default" | "navbar" | "sidebar";
}

export const ThoonLogo = ({ 
  size = "md", 
  showText = true, 
  className = "",
  variant = "default"
}: ThoonLogoProps) => {
  const sizeClasses = {
    sm: {
      logo: "h-8",
      text: "text-lg",
      subtitle: "text-[8px]",
      container: "px-2 py-1.5 gap-2",
      spacing: "ml-2"
    },
    md: {
      logo: "h-10",
      text: "text-xl",
      subtitle: "text-[10px]",
      container: "px-3 py-2 gap-3",
      spacing: "ml-3"
    },
    lg: {
      logo: "h-12",
      text: "text-2xl",
      subtitle: "text-[12px]",
      container: "px-4 py-3 gap-4",
      spacing: "ml-4"
    }
  };

  const currentSize = sizeClasses[size];

  // Navbar variant with glass UI styling - Clean Design
  if (variant === "navbar") {
    return (
      <Link 
        href="/" 
        className={`relative flex items-center ${currentSize.container} bg-white/70 backdrop-blur-xl rounded-xl shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md ${className}`}
      >
        {/* Logo Content */}
        <div className="relative z-10 flex items-center">
          <img 
            src="/thoon_logo_web.svg" 
            alt="Thoon Enterprises" 
            className={`${currentSize.logo} w-auto object-contain transition-all duration-300`}
          />
          
          {showText && (
            <div className="leading-none">
              <div className={`font-oswald ${currentSize.text} font-black text-indigo-950 transition-all duration-300 group-hover:text-amber-600`}>
                THOON
              </div>
              <div className={`${currentSize.subtitle} tracking-widest text-slate-400 transition-all duration-300 group-hover:text-indigo-900`}>
                ENTERPRISES
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Sidebar variant (compact, no background)
  if (variant === "sidebar") {
    return (
      <Link 
        href="/" 
        className={`relative flex items-center ${currentSize.container} transition-all duration-300 hover:scale-105 ${className}`}
      >
        {/* Golden Rolling Outline for Sidebar */}
        <div className="absolute inset-0 rounded-lg p-[1px]">
          <div className="w-full h-full rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 animate-spin-slow opacity-60"></div>
        </div>
        <div className="absolute inset-[1px] rounded-lg bg-transparent"></div>
        
        <div className="relative z-10 flex items-center">
          <div className="relative">
            <img 
              src="/thoon_logo_web.svg" 
              alt="Thoon Enterprises" 
              className={`${currentSize.logo} w-auto object-contain transition-all duration-300`}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)] animate-pulse transition-all duration-300 group-hover:w-4 group-hover:h-4" />
          </div>
          
          {showText && (
            <div className="leading-none">
              <div className={`font-oswald ${currentSize.text} font-black text-indigo-950 transition-all duration-300 group-hover:text-amber-600`}>
                THOON
              </div>
              <div className={`${currentSize.subtitle} tracking-widest text-slate-400 transition-all duration-300 group-hover:text-indigo-900`}>
                ENTERPRISES
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Default variant (original styling)
  return (
    <Link 
      href="/" 
      className={`relative flex items-center select-none group transition-all duration-300 hover:scale-105 hover:drop-shadow-xl ${className}`}
    >
      {/* Golden Rolling Outline for Default */}
      <div className="absolute inset-0 rounded-xl p-[2px]">
        <div className="w-full h-full rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 animate-spin-slow opacity-70"></div>
      </div>
      <div className="absolute inset-[2px] rounded-xl bg-transparent"></div>
      
      <div className="relative z-10 flex items-center">
        <div className="relative flex items-center">
          <img 
            src="/thoon_logo_web.svg" 
            alt="Thoon Enterprises" 
            className={`${currentSize.logo} w-auto object-contain transition-all duration-300 drop-shadow-lg group-hover:drop-shadow-xl`}
          />
          
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)] animate-pulse transition-all duration-300 group-hover:w-4 group-hover:h-4" />
        </div>

        {showText && (
          <div className={`${currentSize.spacing} flex flex-col justify-center leading-none transition-all duration-300`}>
            <span className={`font-oswald ${currentSize.text} font-black text-indigo-950 tracking-widest drop-shadow-sm transition-all duration-300 group-hover:text-amber-600`}>
              THOON
            </span>
            <span className={`${currentSize.subtitle} font-black text-slate-400 tracking-[0.4em] uppercase mt-0.5 opacity-80 transition-all duration-300 group-hover:text-indigo-900 group-hover:opacity-100`}>
              ENTERPRISES
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
