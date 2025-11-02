import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS))
    return await bcrypt.hash(password, salt)
}

export const comparePassword = async (enterPassword, storedHash) => {
    return await bcrypt.compare(enterPassword, storedHash)
}