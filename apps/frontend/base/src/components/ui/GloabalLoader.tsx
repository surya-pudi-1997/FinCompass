import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { cn } from "@/lib/utils";

interface GlobalLoaderProps {
  className?: string;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Lottie Animation */}
        <div className="w-48 h-48 flex items-center justify-center">
          <DotLottieReact
            src="/gloabal-loader.lottie"
            loop
            autoplay
            className="w-full h-full"
          />
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-foreground">FinCompass</h3>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your financial data...
          </p>
        </div>

        {/* Animated progress bar */}
        <div className="w-64 h-1 bg-muted/30 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full animate-[wave_2s_ease-in-out_infinite] transform -translate-x-full"></div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
