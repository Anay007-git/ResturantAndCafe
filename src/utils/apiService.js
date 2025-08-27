const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://prestoguitaracademy.com/api'
  : '/api';

export const apiService = {
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/secure-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/secure-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  async recoverPassword(email) {
    const response = await fetch(`${API_BASE_URL}/secure-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request', email })
    });
    return response.json();
  },

  async resetPassword(email, recoveryCode, newPassword) {
    const response = await fetch(`${API_BASE_URL}/secure-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset', email, token: recoveryCode, newPassword })
    });
    return response.json();
  },

  async createPost(postData) {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return response.json();
  },

  async getPosts() {
    const response = await fetch(`${API_BASE_URL}/posts`);
    return response.json();
  },

  async checkUsername(username) {
    const response = await fetch(`${API_BASE_URL}/check-username?username=${username}`);
    const data = await response.json();
    return !data.available;
  },

  async checkEmail(email) {
    const response = await fetch(`${API_BASE_URL}/check-email?email=${email}`);
    const data = await response.json();
    return !data.available;
  },

  async vote(postId, voteType, userId) {
    const response = await fetch(`${API_BASE_URL}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, voteType, userId })
    });
    return response.json();
  },

  async addComment(postId, content, userId, username) {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content, userId, username })
    });
    return response.json();
  },

  async getComments(postId) {
    const response = await fetch(`${API_BASE_URL}/comments?postId=${postId}`);
    return response.json();
  }
};