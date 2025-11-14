import { body } from 'express-validator'

export const createServiceValidator = [
    body("title")
        .notEmpty().withMessage("El título es obligatorio.")
        .isLength({ min: 5 }).withMessage("El título debe contener al menos 5 caracteres."),

    body("description")
        .notEmpty().withMessage("La descripción es obligatoria.")
        .isLength({ min: 10 }).withMessage("La descripción debe contener al menos 10 caracteres."),

    body("deliveryTime")
        .notEmpty().withMessage("El tiempo de entrega es obligatorio.")
        .isInt({ min: 1 }).withMessage("El tiempo de entrega debe ser un número entero de al menos 1 día."),


    body("price")
        .notEmpty().withMessage("El precio es obligatorio.")
        .isFloat({ min: 1 }).withMessage("El precio debe ser un número positivo."),

    body("categories")
        .notEmpty().withMessage("Debes seleccionar al menos una categoría."),

    // Valida cada elemento dentro del arreglo 'categories'
    body("categories.*")
        .isMongoId().withMessage("Una de las categorías no tiene un ID de Mongoose válido."),

    body("userTitle")
        .optional({ checkFalsy: true })
        .trim()
        .isString().withMessage("El título de usuario debe ser texto.")
        .isLength({ min: 5 }).withMessage("El título de usuario debe tener al menos 5 caracteres."),

    body("userDescription")
        .optional({ checkFalsy: true })
        .trim()
        .isString().withMessage("La descripción de usuario debe ser texto.")
        .isLength({ min: 10 }).withMessage("La descripción de usuario debe tener al menos 10 caracteres."),

    body("location")
        .optional({ checkFalsy: true })
        .trim()
        .isString().withMessage("La ubicación debe ser texto."),

    body("skills")
        .optional(),
    
    body("skills.*")
        .isMongoId().withMessage("Cada habilidad debe ser un ID de Mongoose válido.")
]

export const updateServiceValidator = [
    body("title")
        .notEmpty().withMessage("El título es obligatorio.")
        .isLength({ min: 5 }).withMessage("El título debe contener al menos 5 caracteres."),

    body("description")
        .notEmpty().withMessage("La descripción es obligatoria.")
        .isLength({ min: 10 }).withMessage("La descripción debe contener al menos 10 caracteres."),

    body("deliveryTime")
        .notEmpty().withMessage("El tiempo de entrega es obligatorio.")
        .isInt({ min: 1 }).withMessage("El tiempo de entrega debe ser un número entero de al menos 1 día."),


    body("price")
        .notEmpty().withMessage("El precio es obligatorio.")
        .isFloat({ min: 1 }).withMessage("El precio debe ser un número positivo."),

    body("categories")
        .notEmpty().withMessage("Debes seleccionar al menos una categoría."),

    // Valida cada elemento dentro del arreglo 'categories'
    body("categories.*")
        .isMongoId().withMessage("Una de las categorías no tiene un ID de Mongoose válido.")
]