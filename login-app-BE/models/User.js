// In-memory user storage (replace with database in production)
let users = [];
let currentId = 1;

class User {
  constructor(id, email, password, name) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.createdAt = new Date();
  }

  // Create a new user
  static create(userData) {
    const user = new User(
      currentId++,
      userData.email,
      userData.password,
      userData.name
    );
    users.push(user);
    return user;
  }

  // Find user by email
  static findByEmail(email) {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Find user by ID
  static findById(id) {
    return users.find(user => user.id === parseInt(id));
  }

  // Get all users (without passwords)
  static getAll() {
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }));
  }

  // Update user
  static update(id, updates) {
    const userIndex = users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  }

  // Delete user
  static delete(id) {
    const userIndex = users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) return false;

    users.splice(userIndex, 1);
    return true;
  }
}

module.exports = User;
