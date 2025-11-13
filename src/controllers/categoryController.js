import Category from "../models/Category.js";

export class CategoryController {
    static getCategories = async (req, res) => {
        try {
            const categories = await Category.find().select("name");
            res.status(200).json(categories);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
            res.status(500).json({ message: 'Error al obtener categorías' });
        }
    };

    static createCategory = async (req, res) => {
        try {
            const { name } = req.body;
            const exists = await Category.findOne({ name });
            if (exists) return res.status(400).json({ message: "La categoría ya existe" });

            const category = new Category({ name });
            await category.save();
            res.status(201).send('Categoría creada correctamente');
        } catch (error) {
            console.error("Error al crear categoría:", error);
            res.status(500).json({ message: 'Error al crear categoría' });
        }
    };

    static updateCategory = async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        try {
            const category = await Category.findByIdAndUpdate(
                id,
                { name }
            );
            if (!category) return res.status(404).send('Categoría no encontrada');
            res.status(201).send('Categoría actualizada correctamente');
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
            res.status(500).json({ message: 'Error al actualizar categoría' });
        }
    };

    static deleteCategory = async (req, res) => {
        const { id } = req.params;
        try {
            const category = await Category.findByIdAndDelete(id);
            if (!category) return res.status(404).send('Categoría no encontrada');
            res.status(201).send('Categoría eliminada correctamente');
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            res.status(500).json({ message: 'Error al eliminar categoría' });
        }
    };
}
