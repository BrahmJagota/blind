import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    type: String,
    required: false,
  },
});

const otpSchema = new mongoose.Schema({
  email: {
   type: String,
   unique: true
  },
  otp: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60,
  },
});
const defaultRoomSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    unique: true
  },
  createdBy: {
    type: String,
    requied: true
  },
  expires: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60,
  }
})
defaultRoomSchema.index({ expires: 1 });

const chatSchema = new mongoose.Schema({
  chat: String,
  sendBy: String,
  sendTo: String
})

const roomsSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  roomType: {
    type: String,
    enum: ["PUBLIC", "PRIVATE", 'DEFAULT'],
    required: true,
  },
  createdBy: {
    type: String,
    required: false
  }
})


export const otpModel = mongoose.model('otp', otpSchema);
export const userModel = mongoose.model('users', userSchema);
export const threadsModel = mongoose.model('threads', defaultRoomSchema);
export const chatModel = mongoose.model('chats', chatSchema);
export const roomModel = mongoose.model('rooms', roomsSchema);