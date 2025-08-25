// Community data storage utility
const STORAGE_KEYS = {
  POSTS: 'community_posts',
  USERS: 'community_users',
  VOTES: 'community_votes',
  COMMENTS: 'community_comments'
};

export const communityStorage = {
  // Posts
  getPosts: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
    } catch {
      return [];
    }
  },

  savePosts: (posts) => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  addPost: (post) => {
    const posts = communityStorage.getPosts();
    const newPost = {
      ...post,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      comments: 0
    };
    posts.unshift(newPost);
    communityStorage.savePosts(posts);
    return newPost;
  },

  // Users
  getUsers: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    } catch {
      return [];
    }
  },

  saveUsers: (users) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  checkUsername: (username) => {
    const users = communityStorage.getUsers();
    return users.some(user => user.username.toLowerCase() === username.toLowerCase());
  },

  addUser: (userData) => {
    const users = communityStorage.getUsers();
    const newUser = {
      ...userData,
      id: Date.now(),
      joinDate: new Date().toISOString()
    };
    users.push(newUser);
    communityStorage.saveUsers(users);
    return newUser;
  },

  // Votes
  getVotes: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES)) || {};
    } catch {
      return {};
    }
  },

  saveVotes: (votes) => {
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
  },

  vote: (postId, voteType, userId) => {
    const votes = communityStorage.getVotes();
    const voteKey = `${postId}_${userId}`;
    const posts = communityStorage.getPosts();
    
    // Remove previous vote if exists
    if (votes[voteKey]) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        if (votes[voteKey] === 'up') post.upvotes--;
        if (votes[voteKey] === 'down') post.downvotes--;
      }
    }
    
    // Add new vote or remove if same
    if (votes[voteKey] === voteType) {
      delete votes[voteKey];
    } else {
      votes[voteKey] = voteType;
      const post = posts.find(p => p.id === postId);
      if (post) {
        if (voteType === 'up') post.upvotes++;
        if (voteType === 'down') post.downvotes++;
      }
    }
    
    communityStorage.saveVotes(votes);
    communityStorage.savePosts(posts);
    return votes[voteKey];
  },

  getUserVote: (postId, userId) => {
    const votes = communityStorage.getVotes();
    return votes[`${postId}_${userId}`] || null;
  },

  // Comments
  getComments: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS)) || {};
    } catch {
      return {};
    }
  },

  saveComments: (comments) => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  },

  addComment: (postId, comment, userId, username) => {
    const comments = communityStorage.getComments();
    const posts = communityStorage.getPosts();
    
    if (!comments[postId]) comments[postId] = [];
    
    const newComment = {
      id: Date.now(),
      postId,
      userId,
      username,
      content: comment,
      timestamp: new Date().toISOString()
    };
    
    comments[postId].push(newComment);
    
    // Update comment count
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments = comments[postId].length;
    }
    
    communityStorage.saveComments(comments);
    communityStorage.savePosts(posts);
    return newComment;
  },

  getPostComments: (postId) => {
    const comments = communityStorage.getComments();
    return comments[postId] || [];
  }
};