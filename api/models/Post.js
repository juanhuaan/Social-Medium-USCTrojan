const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    tags: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    isComment:{ type: Boolean, default: false}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
