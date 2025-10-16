import { User, Content, Review, UserActivity, Recommendation } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'alex_cine',
    displayName: 'Alex Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Film enthusiast & critic. Always watching something new!',
    followersCount: 2450,
    followingCount: 180
  },
  {
    id: '2',
    username: 'sarah_reads',
    displayName: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c1d0?w=150&h=150&fit=crop&crop=face',
    bio: 'Bookworm & podcast addict. Love sci-fi and fantasy!',
    followersCount: 1820,
    followingCount: 340
  },
  {
    id: '3',
    username: 'mike_sounds',
    displayName: 'Mike Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Music producer & vinyl collector. Jazz & electronic.',
    followersCount: 3100,
    followingCount: 95
  },
  {
    id: '4',
    username: 'emma_streams',
    displayName: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Series binge-watcher extraordinaire. Currently obsessed with K-dramas!',
    followersCount: 890,
    followingCount: 256
  },
  {
    id: '5',
    username: 'james_critic',
    displayName: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Professional film critic. Writing reviews since 2015.',
    followersCount: 5200,
    followingCount: 124
  },
  {
    id: '6',
    username: 'lily_books',
    displayName: 'Lily Park',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    bio: 'Young adult fiction lover. Reading goal: 100 books this year!',
    followersCount: 1100,
    followingCount: 450
  }
];

export const mockContent: Content[] = [
  {
    id: '1',
    title: 'Dune: Part Two',
    type: 'movie',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
    year: 2024,
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    director: 'Denis Villeneuve',
    duration: '2h 46m',
    rating: 4.6,
    totalRatings: 15420,
    stats: {
      watched: 8920,
      watching: 450,
      watchlist: 3240,
      interested: 1850,
      notInterested: 120
    }
  },
  {
    id: '2',
    title: 'The Three-Body Problem',
    type: 'book',
    poster: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
    year: 2006,
    genre: ['Science Fiction', 'Hard Sci-Fi'],
    description: 'Set against the backdrop of China\'s Cultural Revolution, a secret military project sends signals into space.',
    author: 'Liu Cixin',
    rating: 4.3,
    totalRatings: 8750,
    stats: {
      watched: 4520,
      watching: 890,
      watchlist: 2100,
      interested: 980,
      notInterested: 45
    }
  },
  {
    id: '3',
    title: 'Stranger Things',
    type: 'series',
    poster: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop',
    year: 2016,
    genre: ['Horror', 'Drama', 'Fantasy'],
    description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.',
    episodes: 42,
    rating: 4.4,
    totalRatings: 22100,
    stats: {
      watched: 12500,
      watching: 1800,
      watchlist: 4200,
      interested: 2100,
      notInterested: 180
    }
  },
  {
    id: '4',
    title: 'Interstellar',
    type: 'music',
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=450&fit=crop',
    year: 2014,
    genre: ['Soundtrack', 'Classical', 'Electronic'],
    description: 'Hans Zimmer\'s masterpiece soundtrack that perfectly captures the vastness and emotion of space exploration.',
    artist: 'Hans Zimmer',
    duration: '1h 12m',
    rating: 4.8,
    totalRatings: 6420,
    stats: {
      watched: 3200,
      watching: 120,
      watchlist: 1500,
      interested: 800,
      notInterested: 25
    }
  },
  {
    id: '5',
    title: 'The Joe Rogan Experience',
    type: 'podcast',
    poster: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=450&fit=crop',
    year: 2009,
    genre: ['Talk', 'Comedy', 'Interview'],
    description: 'Long-form conversations with a variety of guests including comedians, actors, musicians, MMA fighters, authors, and more.',
    rating: 4.1,
    totalRatings: 18900,
    stats: {
      watched: 25000,
      watching: 5200,
      watchlist: 1800,
      interested: 3400,
      notInterested: 890
    }
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    contentId: '1',
    rating: 5,
    comment: 'Denis Villeneuve has outdone himself! The visuals are absolutely stunning and the story builds perfectly on the first film. Hans Zimmer\'s score is otherworldly.',
    createdAt: '2024-03-15T10:30:00Z',
    likes: 142
  },
  {
    id: '2',
    userId: '2',
    contentId: '2',
    rating: 4,
    comment: 'Mind-bending hard sci-fi that really makes you think about humanity\'s place in the universe. The physics concepts are fascinating, though it can be dense at times.',
    createdAt: '2024-03-14T15:45:00Z',
    likes: 89
  },
  {
    id: '3',
    userId: '3',
    contentId: '4',
    rating: 5,
    comment: 'This soundtrack is a masterclass in emotional storytelling through music. Every track perfectly captures the vastness and intimacy of the film.',
    createdAt: '2024-03-13T20:15:00Z',
    likes: 67
  }
];

export const mockActivities: UserActivity[] = [
  {
    id: '1',
    userId: '1',
    contentId: '1',
    type: 'watched',
    timestamp: '2024-03-15T22:30:00Z',
    rating: 5
  },
  {
    id: '2',
    userId: '2',
    contentId: '3',
    type: 'watching',
    timestamp: '2024-03-15T20:15:00Z'
  },
  {
    id: '3',
    userId: '3',
    contentId: '4',
    type: 'rated',
    timestamp: '2024-03-14T18:45:00Z',
    rating: 5
  },
  {
    id: '4',
    userId: '1',
    contentId: '2',
    type: 'added_to_watchlist',
    timestamp: '2024-03-14T12:20:00Z'
  },
  {
    id: '5',
    userId: '2',
    contentId: '5',
    type: 'reviewed',
    timestamp: '2024-03-13T16:30:00Z'
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    fromUserId: '1',
    toUserId: '2',
    contentId: '1',
    message: 'You HAVE to watch this! The cinematography is incredible and the story really picks up from where Part One left off.',
    timestamp: '2024-03-15T09:30:00Z'
  },
  {
    id: '2',
    fromUserId: '2',
    toUserId: '3',
    contentId: '2',
    message: 'Since you loved Interstellar, this book will blow your mind. The physics concepts are fascinating!',
    timestamp: '2024-03-14T14:20:00Z'
  },
  {
    id: '3',
    fromUserId: '3',
    toUserId: '1',
    contentId: '4',
    message: 'This soundtrack is perfect for your film scoring interests. Hans Zimmer at his absolute best.',
    timestamp: '2024-03-13T19:45:00Z'
  }
];