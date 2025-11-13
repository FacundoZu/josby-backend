import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (_req, file, cb) => {

    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error("Solo se permiten archivos de imagen"), false)
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { //tamaño max de 5mb
        fileSize: 5 * 1024 * 1024
    }
})