const BLOB_TOKEN = 'vercel_blob_rw_nAPRe8maBjE2wTQ0_Ygyy750hVQ2AMm8y4UzdNB0NfyGuYO';
const STORE_BASE_URL = 'https://napre8mabje2wtq0.public.blob.vercel-storage.com';

const BLOB_KEYS = {
  POSTS: 'community-posts.json',
  USERS: 'community-users.json'
};

export const blobStorage = {
  async uploadData(key, data) {
    try {
      const response = await fetch(`${STORE_BASE_URL}/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${BLOB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      console.error('Blob upload error:', error);
      return false;
    }
  },

  async downloadData(key) {
    try {
      const response = await fetch(`${STORE_BASE_URL}/${key}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Blob download error:', error);
      return null;
    }
  },

  async savePosts(posts) {
    const success = await this.uploadData(BLOB_KEYS.POSTS, posts);
    localStorage.setItem('community_posts', JSON.stringify(posts));
    return success;
  },

  async getPosts() {
    try {
      const blobPosts = await this.downloadData(BLOB_KEYS.POSTS);
      if (blobPosts) {
        localStorage.setItem('community_posts', JSON.stringify(blobPosts));
        return blobPosts;
      }
    } catch (error) {
      console.log('Using local storage fallback');
    }
    return JSON.parse(localStorage.getItem('community_posts') || '[]');
  },

  async saveUsers(users) {
    const success = await this.uploadData(BLOB_KEYS.USERS, users);
    localStorage.setItem('community_users', JSON.stringify(users));
    return success;
  },

  async getUsers() {
    try {
      const blobUsers = await this.downloadData(BLOB_KEYS.USERS);
      if (blobUsers) {
        localStorage.setItem('community_users', JSON.stringify(blobUsers));
        return blobUsers;
      }
    } catch (error) {
      console.log('Using local storage fallback');
    }
    return JSON.parse(localStorage.getItem('community_users') || '[]');
  }
};