import { User } from "../models/user.js";

export class UserRepository {
  async findByEmailOrUsername(email, username) {
    return User.findOne({
      $or: [{ email }, { username }],
    });
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async findById(id) {
    return User.findById(id);
  }

  async findAll() {
    return User.find({});
  }

  async search(term) {
    return User.find({
      $or: [
        { username: { $regex: term, $options: "i" } },
        { city: { $regex: term, $options: "i" } },
        { state: { $regex: term, $options: "i" } },
      ],
    });
  }

  async updateProfile(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async addSong(userId, songData) {
    return User.findByIdAndUpdate(
      userId,
      { $push: { songs: songData } },
      { new: true }
    );
  }

  async updateStreams(userId) {
    return User.findByIdAndUpdate(
      userId,
      { $inc: { streams: 1 } },
      { new: true }
    );
  }
}
