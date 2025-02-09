import { cn } from "@/lib/utils";

export function RetroGrid({
  className,
  angle = 65,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute w-full h-full overflow-hidden opacity-50 [perspective:200px]",
        "background-0d dark:background-0d",
        className
      )}
      style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 [transform:rotateX(var(--grid-angle))]"
        style={{ background: "transparent" }}
      >
        <div
          className={cn(
            "animate-grid",
            "absolute w-[600vw] h-[300vh] -ml-[50%]",
            "[background-repeat:repeat] [background-size:60px_60px]",
            "[transform-origin:100%_0_0]",
            "[background-image:linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_0)]"
          )}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90%" />
    </div>
  );
}
