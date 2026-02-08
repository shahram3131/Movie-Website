import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export async function register(req, res, next) {
  try {
    const { username, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    // Validate role if provided
    const allowed = ["user", "premium", "moderator", "admin"];
    let assignedRole = "user";
    if (role && allowed.includes(role)) assignedRole = role;

    // Enforce single-admin policy: only allow creating 'admin' if none exists
    if (assignedRole === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount > 0) {
        // Do not allow creating another admin
        return res.status(403).json({ message: "An admin account already exists" });
      }
    }

    // If premium, expect card info and store only last4 and premiumSince
    let paymentLast4 = undefined;
    if (assignedRole === "premium") {
      const { cardNumber } = req.body;
      if (!cardNumber || cardNumber.length < 4) {
        return res.status(400).json({ message: "Invalid card info" });
      }
      paymentLast4 = cardNumber.slice(-4);
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hash,
      role: assignedRole,
      ...(paymentLast4 && { paymentLast4, premiumSince: new Date() }),
    });

    return res.status(201).json({ message: "Registered", userId: user._id, role: user.role });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken({ sub: user._id.toString(), role: user.role }, "7d");

    return res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}
