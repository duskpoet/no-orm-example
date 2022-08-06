import { User } from "../models/user";
import { pgAdapter } from "./adapter";

export const userRepository = pgAdapter(User);
