import mongoose from "mongoose";

//tạo schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, //createdAt và updatedAt tự động thêm vào
  }
);

//tạo model dựa trên schema
const Task = mongoose.model("Task", taskSchema);
export default Task;
