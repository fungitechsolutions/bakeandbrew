interface UserAvatarProps {
  name: string;
  imageUrl: string | null;
  size?: "sm" | "lg" | "xl";
  round?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserAvatar({
  name,
  imageUrl,
  size = "sm",
  round = false,
}: UserAvatarProps) {
  const sizeClasses =
    size === "xl"
      ? "w-24 h-24 text-3xl border-2"
      : size === "lg"
        ? "w-20 h-20 text-2xl border-2"
        : "w-8 h-8 text-xs border";
  const shapeClasses = round ? "rounded-full" : "rounded-none";

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={`${name}&apos;s avatar`}
        className={`${sizeClasses} ${shapeClasses} border-[rgba(47,78,64,0.25)] object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} ${shapeClasses} flex shrink-0 items-center justify-center border-[rgba(47,78,64,0.25)] bg-[rgba(47,78,64,0.08)] font-mono font-bold text-(--brand-green)`}
      aria-label={`Avatar placeholder for ${name}`}
    >
      {getInitials(name)}
    </div>
  );
}
