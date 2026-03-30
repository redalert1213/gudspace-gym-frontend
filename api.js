const API_URL = 'https://gudspace-gym-backend.onrender.com/api';

window.GudAPI = {
  getToken: function() {
    const user = window.GudSpace.storage.get('currentUser');
    return user ? user.token : null;
  },

  /* ---- AUTH ---- */
  register: async function(data) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  login: async function(data) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  /* ---- PROFILE ---- */
  getProfile: async function() {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  updateProfile: async function(data) {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  uploadAvatar: async function(formData) {
    const res = await fetch(`${API_URL}/profile/avatar`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + this.getToken() },
      body: formData
    });
    return res.json();
  },

  /* ---- WORKOUTS ---- */
  logWorkout: async function(data) {
    const res = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getWorkouts: async function() {
    const res = await fetch(`${API_URL}/workouts`, {
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  deleteWorkout: async function(id) {
    const res = await fetch(`${API_URL}/workouts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },

  /* ---- WATER ---- */
  getWater: async function() {
    const res = await fetch(`${API_URL}/water`, {
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  updateWater: async function(glasses) {
    const res = await fetch(`${API_URL}/water`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      },
      body: JSON.stringify({ glasses })
    });
    return res.json();
  },

  /* ---- ATTENDANCE ---- */
  checkIn: async function() {
    const res = await fetch(`${API_URL}/attendance/checkin`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  checkOut: async function(id) {
    const res = await fetch(`${API_URL}/attendance/checkout/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  getAttendance: async function() {
    const res = await fetch(`${API_URL}/attendance`, {
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  getTodayPresence: async function() {
    const res = await fetch(`${API_URL}/attendance/today`, {
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },

  /* ---- ANNOUNCEMENTS ---- */
  getAnnouncements: async function() {
    const res = await fetch(`${API_URL}/announcements`, {
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  postAnnouncement: async function(data) {
    const res = await fetch(`${API_URL}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteAnnouncement: async function(id) {
    const res = await fetch(`${API_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },

  /* ---- MESSAGES ---- */
  getMessages: async function() {
    const res = await fetch(`${API_URL}/messages`, {
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  sendMessage: async function(text) {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      },
      body: JSON.stringify({ text })
    });
    return res.json();
  },
  markMessagesRead: async function() {
    const res = await fetch(`${API_URL}/messages/read`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  // Admin message endpoints
  adminGetAllThreads: async function() {
    const res = await fetch(`${API_URL}/messages/admin/all`, {
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  adminSendMessage: async function(user_id, text) {
    const res = await fetch(`${API_URL}/messages/admin/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      },
      body: JSON.stringify({ user_id, text })
    });
    return res.json();
  },
  adminMarkRead: async function(user_id) {
    const res = await fetch(`${API_URL}/messages/admin/read/${user_id}`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },

  /* ---- MEMBERSHIPS ---- */
  getMyMembership: async function() {
    const res = await fetch(`${API_URL}/memberships/me`, {
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  requestRenewal: async function() {
    const res = await fetch(`${API_URL}/memberships/renew-request`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  adminAssignPlan: async function(data) {
    const res = await fetch(`${API_URL}/memberships/admin/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  adminRemovePlan: async function(user_id) {
    const res = await fetch(`${API_URL}/memberships/admin/${user_id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  },
  adminDismissRenewal: async function(user_id) {
    const res = await fetch(`${API_URL}/memberships/admin/dismiss-renewal/${user_id}`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer ' + this.getToken() }
    });
    return res.json();
  }
};
