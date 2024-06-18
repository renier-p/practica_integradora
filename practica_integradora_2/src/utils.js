import {dirname} from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcryptjs"

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

export  const __dirname=dirname(fileURLToPath(import.meta.url))

