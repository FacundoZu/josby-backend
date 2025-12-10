import User from "../models/User.js";
import Service from "../models/Service.js";
import { hashPassword, comparePassword } from "../utils/auth.js";
import { uploadProfileImageToCloudinary } from "../utils/uploadImage.js";
import { generateJWT } from "../utils/jwt.js";

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

            const token = generateJWT({ id: newUser._id })

            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV == 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            }).send('Usuario registrado correctamente')

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            res.status(500).json({ error: error.message });
        }
    };

    static getProfile = async (req, res) => {
        try {
            const userId = req.user.id;

            const user = await User.findById(userId)
                .select("-password")
                .populate("skills", "name")
                .lean();

            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            let services = [];
            if (user.role === "freelancer") {
                services = await Service.find({ usuarioId: userId })
                    .populate("categories", "name logo")
                    .lean();
            }

            res.status(200).json({ user, services });
        } catch (error) {
            console.error("Error al obtener perfil:", error);
            res.status(500).json({ message: "Error al obtener perfil" });
        }
    }

    static updateProfile = async (req, res) => {
        try {
            const userId = req.user.id;
            const { firstname, lastname, birthdate, password, currentPassword, image } = req.body;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            const updateData = {};
            if (firstname) updateData.firstname = firstname;
            if (lastname) updateData.lastname = lastname;
            if (birthdate) updateData.birthdate = birthdate;

            if (password) {
                if (user.providerId) {
                    return res.status(400).json({
                        message: "No puedes cambiar la contraseña de una cuenta de Google"
                    });
                }

                if (!currentPassword) {
                    return res.status(400).json({ message: "Debe proporcionar la contraseña actual para cambiarla" });
                }

                const isPasswordValid = await comparePassword(currentPassword, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ message: "La contraseña actual es incorrecta" });
                }

                updateData.password = await hashPassword(password);
            }

            if (image && image.startsWith('data:image')) {
                try {
                    const base64Data = image.split(',')[1];
                    const imageBuffer = Buffer.from(base64Data, 'base64');
                    const uploadResult = await uploadProfileImageToCloudinary(imageBuffer);
                    updateData.image = uploadResult.secure_url;
                } catch (uploadError) {
                    console.error("Error al subir imagen:", uploadError);
                    return res.status(500).json({ message: "Error al subir la imagen" });
                }
            } else if (image) {
                updateData.image = image;
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            ).select("-password");

            res.status(200).json({
                message: "Perfil actualizado correctamente",
                user: updatedUser
            });
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            res.status(500).json({ message: "Error al actualizar perfil" });
        }
    }

    static getUserServices = async (req, res) => {
        try {
            const userId = req.user.id;

            const services = await Service.find({ usuarioId: userId })
                .populate("categories", "name logo")
                .sort({ createdAt: -1 })
                .lean();

            res.status(200).json(services);
        } catch (error) {
            console.error("Error al obtener servicios del usuario:", error);
            res.status(500).json({ message: "Error al obtener servicios" });
        }
    }
}
