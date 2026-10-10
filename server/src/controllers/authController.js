import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { httpError } from "../middleware/errorHandler.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

// Rejects objects like { "$gt": "" } so request bodies can't inject MongoDB operators
function requireStrings(body, fields) {
  for (const field of fields) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      throw httpError(400, `${field[0].toUpperCase() + field.slice(1)} is required`);
    }
  }
}

export async function register(req, res) {
  const body = req.body ?? {};
  requireStrings(body, ["name", "email", "password"]);

  const user = await User.create({ name: body.name, email: body.email, password: body.password });
  res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
}

export async function login(req, res) {
  const body = req.body ?? {};
  requireStrings(body, ["email", "password"]);

  const user = await User.findOne({ email: body.email.toLowerCase().trim() }).select("+password");
  if (!user || !(await user.matchPassword(body.password))) {
    throw httpError(401, "Invalid email or password");
  }

  res.json({ token: signToken(user._id), user: publicUser(user) });
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
