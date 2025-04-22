import { UserRepository } from "../repositories/UserRepository.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async signup(userData) {
    const existingUser = await this.userRepository.findByEmailOrUsername(
      userData.email,
      userData.username
    );

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    return this.userRepository.create(userData);
  }

  async getUserProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user._id,
      name: user.username,
      email: user.email,
      songs: user.songs,
      bio: user.bio,
      city: user.city,
      state: user.state,
      streams: user.streams || 0,
    };
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user._id,
      name: user.username,
      email: user.email,
      streams: user.streams || 0,
      bio: user.bio,
      city: user.city,
      state: user.state,
      songs: user.songs,
    }));
  }

  async searchUsers(term) {
    return this.userRepository.search(term);
  }

  async addSong(userId, songData) {
    return this.userRepository.addSong(userId, songData);
  }

  async incrementStreams(userId) {
    return this.userRepository.updateStreams(userId);
  }
}
