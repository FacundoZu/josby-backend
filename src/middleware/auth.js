import jwt from 'jsonwebtoken'
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        const error = new Error('No Autorizado')
        res.status(401).json({ error: error.message })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id firstname lastname email role image')

            if (user) {
                req.user = user
                next()
            } else {
                res.status(500).json({ error: 'Token No Valido' })
                return
            }
        }

    } catch (error) {
        res.status(500).json({ error: 'Token No Valido' })
        return
    }
}

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                message: 'Usuario no autenticado',
                error: 'Sin autorización',
            })
            return
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: 'No tienes permisos para realizar esta acción',
                error: 'Acceso denegado',
            })
            return
        }

        next()
    }
}