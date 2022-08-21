import { pgAdapter } from "./adapter";

export const userRepository = pgAdapter('users');
