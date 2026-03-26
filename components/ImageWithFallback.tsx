import { useState } from "react";

export interface ImageWithFallbackProps {
	/** Image source path (e.g., from imageMap.ts helpers) */
	src: string;
	/** Alt text for accessibility */
	alt: string;
	/** Aspect ratio variant: video (16:9), square (1:1), or auto */
	aspectRatio?: "video" | "square" | "auto";
	/** Additional classes for the image element */
	className?: string;
	/** Additional classes for the container */
	containerClassName?: string;
}

/**
 * ImageWithFallback - Reusable image component with glitch placeholder fallback
 *
 * Features:
 * - Native lazy loading (loading="lazy") for performance
 * - Glitch placeholder with scanline effect while loading
 * - Smooth fade-in transition over 300ms
 * - Fallback placeholder on load error
 * - Responsive aspect ratios (video 16:9, square 1:1, auto)
 * - Rounded corners and overflow hidden
 *
 * Usage:
 * ```tsx
 * <ImageWithFallback
 *   src={getIncidentImagePath(slug)}
 *   alt="Incident image"
 *   aspectRatio="video"
 * />
 * ```
 */
export function ImageWithFallback({
	src,
	alt,
	aspectRatio = "video",
	className = "",
	containerClassName = "",
}: ImageWithFallbackProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);

	const shouldShowPlaceholder = !isLoaded || hasError;

	// Map aspectRatio to Tailwind classes
	const aspectClasses = {
		video: "aspect-video",
		square: "aspect-square",
		auto: "",
	};

	return (
		<div
			className={`
        relative
        overflow-hidden
        rounded-lg
        border border-slate-700
        bg-slate-900
        ${aspectClasses[aspectRatio]}
        ${containerClassName}
      `.trim()}
		>
			{/* Glitch Placeholder - shown while loading or on error */}
			{shouldShowPlaceholder && (
				<div
					className={`
            absolute inset-0
            flex items-center justify-center
            bg-gradient-to-b from-slate-800 to-slate-900
            transition-opacity duration-300 ease-out
            ${isLoaded && !hasError ? "opacity-0 pointer-events-none" : "opacity-100"}
          `.trim()}
					style={{
						backgroundImage: `
              repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 2px,
                transparent 2px,
                transparent 4px
              )
            `,
						animation: "glitch-scan 0.15s infinite",
					}}
				>
					<i className="fa-solid fa-image text-cyan-500 text-3xl animate-pulse" />
				</div>
			)}

			{/* Image Element */}
			<img
				src={src}
				alt={alt}
				loading="lazy"
				className={`
          w-full h-full
          object-cover
          transition-opacity duration-300 ease-out
          ${isLoaded && !hasError ? "opacity-100" : "opacity-0"}
          ${className}
        `.trim()}
				onLoad={() => setIsLoaded(true)}
				onError={() => setHasError(true)}
			/>

			{/* CSS Animations - injected inline for component scoping */}
			<style>{`
        @keyframes glitch-scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(4px);
          }
        }
      `}</style>
		</div>
	);
}
