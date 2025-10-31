import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const VideoCard = ({ thumbnail, title, channel, views, timestamp, duration }) => {
  // ✅ Fallbacks for missing data
  const safeTitle = title || "Untitled Video";
  const safeChannel = channel || "Unknown Channel";
  const safeThumbnail = thumbnail || "/placeholder.jpg";
  const safeViews = views ?? 0;
  const safeTimestamp = timestamp || "Just now";
  const safeDuration = duration || "";

  return (
    <div className="group cursor-pointer">
      <div className="relative mb-3 overflow-hidden rounded-xl">
        <img
          src={safeThumbnail}
          alt={safeTitle}
          className="w-full aspect-video object-cover transition-transform duration-200 group-hover:scale-105"
        />
        {safeDuration && (
          <span className="absolute bottom-2 right-2 bg-black/90 px-1.5 py-0.5 text-xs font-semibold rounded">
            {safeDuration}
          </span>
        )}
      </div>
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarFallback className="bg-secondary text-xs">
            {safeChannel.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-foreground">
            {safeTitle}
          </h3>
          <p className="text-xs text-youtube-text-secondary">{safeChannel}</p>
          <div className="flex items-center gap-1 text-xs text-youtube-text-secondary">
            <span>{safeViews} views</span>
            <span>•</span>
            <span>{safeTimestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
