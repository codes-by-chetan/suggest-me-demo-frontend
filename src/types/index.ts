export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
}

export interface Content {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'book' | 'music' | 'podcast';
  poster: string;
  year: number;
  genre: string[];
  description: string;
  director?: string;
  author?: string;
  artist?: string;
  duration?: string;
  episodes?: number;
  rating: number;
  totalRatings: number;
  stats: {
    watched: number;
    watching: number;
    watchlist: number;
    interested: number;
    notInterested: number;
  };
}

export interface Review {
  id: string;
  userId: string;
  contentId: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  contentId: string;
  type: 'watched' | 'watching' | 'added_to_watchlist' | 'rated' | 'reviewed';
  timestamp: string;
  rating?: number;
}

export interface Recommendation {
  id: string;
  fromUserId: string;
  toUserId: string;
  contentId: string;
  message: string;
  timestamp: string;
}

export type WatchStatus = 'watched' | 'watching' | 'watchlist' | 'interested' | 'not_interested' | null;