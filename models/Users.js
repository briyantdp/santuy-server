const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

usersSchema.pre('save', async function() {
  const users = this;
  if(users.isModified('password')) {
    users.password = await bcrypt.hash(users.password, 8);
  }
})

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;
