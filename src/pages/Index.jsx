import { VideoCard } from "@/components/VideoCard";
import thumb1 from "@/assets/thumb1.jpg";
import thumb2 from "@/assets/thumb2.jpg";
import thumb3 from "@/assets/thumb3.jpg";
import thumb4 from "@/assets/thumb4.jpg";
import thumb5 from "@/assets/thumb5.jpg";
import thumb6 from "@/assets/thumb6.jpg";

const videos = [
  { id: 1, thumbnail: thumb1, title: "Amazing Sunset Timelapse - Nature's Beauty in 4K", channel: "Nature Lovers", views: "2.4M", timestamp: "2 days ago", duration: "10:24" },
  { id: 2, thumbnail: thumb2, title: "Top 10 Tech Gadgets You NEED in 2024", channel: "Tech Review", views: "892K", timestamp: "1 week ago", duration: "15:32" },
  { id: 3, thumbnail: thumb3, title: "Learn React in 30 Minutes - Complete Beginner Tutorial", channel: "Code Master", views: "1.2M", timestamp: "3 days ago", duration: "30:15" },
  { id: 4, thumbnail: thumb4, title: "Full Body Workout - No Equipment Needed!", channel: "Fitness Pro", views: "654K", timestamp: "5 days ago", duration: "12:48" },
  { id: 5, thumbnail: thumb5, title: "5-Minute Recipes - Quick & Delicious Meals", channel: "Cooking Made Easy", views: "3.1M", timestamp: "1 day ago", duration: "8:20" },
  { id: 6, thumbnail: thumb6, title: "Top 10 Travel Destinations for 2024", channel: "Travel Guide", views: "1.8M", timestamp: "4 days ago", duration: "18:45" },
  { id: 7, thumbnail: thumb1, title: "Meditation & Mindfulness - Find Your Peace", channel: "Wellness Hub", views: "445K", timestamp: "6 days ago", duration: "20:00" },
  { id: 8, thumbnail: thumb2, title: "iPhone 15 Pro Max - Full Review & Unboxing", channel: "Tech Review", views: "2.9M", timestamp: "2 weeks ago", duration: "25:12" },
  { id: 9, thumbnail: thumb3, title: "JavaScript Tips & Tricks Every Developer Should Know", channel: "Code Master", views: "987K", timestamp: "1 week ago", duration: "22:30" },
  { id: 10, thumbnail: thumb4, title: "Yoga for Beginners - Complete 30-Day Challenge", channel: "Fitness Pro", views: "1.5M", timestamp: "3 weeks ago", duration: "45:00" },
  { id: 11, thumbnail: thumb5, title: "Baking the Perfect Chocolate Cake - Step by Step", channel: "Cooking Made Easy", views: "876K", timestamp: "5 days ago", duration: "16:35" },
  { id: 12, thumbnail: thumb6, title: "Budget Travel Hacks - See the World for Less", channel: "Travel Guide", views: "1.1M", timestamp: "1 week ago", duration: "14:20" },
];

const Index = () => (
  <main className="pt-14">
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </div>
  </main>
);

export default Index;
