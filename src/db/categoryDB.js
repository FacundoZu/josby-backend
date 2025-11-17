import Category from "../models/Category.js"

export const loadCategories = async () => {
    try{
        const existingCategories = await Category.find()
    
        if(existingCategories.length > 0){
            console.log("Las categorías ya están cargadas")
            return
        }
    
        const categories = [
            { name: 'Tecnología & Programación', logo: '💻' },
            { name: 'Diseño & Creatividad', logo: '🎨' },
            { name: 'Marketing & Publicidad', logo: '📢' },
            { name: 'Escritura & Traducción', logo: '✍️' },
            { name: 'Administración & Finanzas', logo: '📂' },
            { name: 'Asistencia Virtual', logo: '🤖' },
            { name: 'Audio & Música', logo: '🎵' },
            { name: 'Video & Animación', logo: '🎬' },
            { name: 'Soporte Técnico & Mantenimiento', logo: '🛠️' },
            { name: 'Emprendimiento & Consultorías', logo: '📈' },
        ]
    
        await Category.insertMany(categories)
        console.log("Categorías cargadas correctamente.")
        
    }catch(error){
        console.error("Error al cargar categorías:", error)
    }
}