import { put } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';

const defaultPosts = [
  {
    id: 1,
    author: 'GuitarMaster92',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GuitarMaster92',
    time: '2h ago',
    category: 'Doubt',
    title: 'Struggling with F chord transition - Need help!',
    content: 'I\'ve been practicing for weeks but still can\'t get smooth transitions from C to F chord. My fingers keep muting strings. Any tips from experienced players?',
    upvotes: 24,
    downvotes: 2,
    comments: 12,
    tags: ['beginner', 'chords', 'technique'],
    userBadge: 'Beginner',
    verified: true
  },
  {
    id: 2,
    author: 'StrumQueen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StrumQueen',
    time: '4h ago',
    category: 'Solution',
    title: 'How I mastered barre chords in 30 days',
    content: 'After struggling with barre chords for months, I found a practice routine that worked:\n\n1. Start with partial barre (2-3 strings)\n2. Practice 5 minutes daily\n3. Focus on thumb position\n4. Use lighter gauge strings initially\n\nNow I can play F, Bm, and other barre chords cleanly!',
    upvotes: 67,
    downvotes: 1,
    comments: 23,
    tags: ['technique', 'practice', 'barre-chords'],
    userBadge: 'Expert',
    verified: true
  },
  {
    id: 3,
    author: 'BluesLover88',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BluesLover88',
    time: '6h ago',
    category: 'Confession',
    title: 'I\'ve been playing for 5 years and still can\'t play Wonderwall properly',
    content: 'Everyone expects me to know it since I play guitar, but I never actually learned it properly. The strumming pattern always trips me up. Anyone else have songs they "should" know but don\'t?',
    upvotes: 156,
    downvotes: 8,
    comments: 45,
    tags: ['confession', 'strumming', 'popular-songs'],
    userBadge: 'Intermediate',
    verified: false
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await put('posts.json', JSON.stringify(defaultPosts), { 
      access: 'public', 
      token: BLOB_TOKEN,
      allowOverwrite: true
    });

    await put('comments.json', JSON.stringify([]), { 
      access: 'public', 
      token: BLOB_TOKEN,
      allowOverwrite: true
    });

    res.json({ success: true, message: 'Posts initialized', count: defaultPosts.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}