const API_URL = 'https://gudspace-gym-backend.onrender.com/api';

window.GudAPI = {
  getToken: function() {
    const user = window.GudSpace.storage.get('currentUser');
    return user ? user.token : null;
  },
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
  }
};