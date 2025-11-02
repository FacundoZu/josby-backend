import User from "../models/User.js";
import { hashPassword } from "../utils/auth.js";

export class UserController {

    static registerUser = async (req, res) => {
        try {
            const { firstname, lastname, email, password, birthdate } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                const error = new Error('Ya existe un usuario con ese email')
                res.status(404).json({ error: error.message })
                return
            }

            const hashedPassword = await hashPassword(password)

            const newUser = new User({
                firstname,
                lastname,
                email,
                password: hashedPassword,
                birthdate,
            });

            await newUser.save();

            res.status(201).send('Usuario registrado correctamente')

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            res.status(500).json({ error: error.message });
        }
    };

    static user = async (req, res) => {
        res.json(req.user)
        return
    }
}
