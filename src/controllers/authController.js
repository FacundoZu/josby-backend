import User from "../models/User.js";
import { comparePassword } from "../utils/auth.js";
import { generateJWT } from "../utils/jwt.js";

export class AuthController {

    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            const passwordMatch = await comparePassword(password, user.password)
            if (!passwordMatch) {
                const error = new Error('Contraseña incorrecta')
                res.status(401).json({ error: error.message })
                return
            }

            const token = generateJWT({ id: user._id })

            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV == 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            }).send('Login correcto')

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };

}
