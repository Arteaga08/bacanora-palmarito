import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminUserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    role: {
      type: String,
      default: "Admin",
      immutable: true,
    },
  },
  { timestamps: true },
);

AdminUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

AdminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // ✅ AGREGADO EL RETURN
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
export default AdminUser;
