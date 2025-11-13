import Skill from "../models/Skill.js";

export class SkillController {
    static getSkills = async (req, res) => {
        try {
            const skills = await Skill.find().select("name");
            res.status(200).json(skills);
        } catch (error) {
            console.error("Error al obtener habilidades:", error);
            res.status(500).json({ message: 'Error al obtener habilidades' });
        }
    };

    static createSkill = async (req, res) => {
        try {
            const { name } = req.body;
            const exists = await Skill.findOne({ name });
            if (exists) return res.status(400).json({ message: "La habilidad ya existe" });

            const skill = new Skill({ name });
            await skill.save();
            res.status(201).send('Habilidad creada correctamente');
        } catch (error) {
            console.error("Error al crear habilidad:", error);
            res.status(500).json({ message: 'Error al crear habilidad' });
        }
    };

    static updateSkill = async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        try {
            const skill = await Skill.findByIdAndUpdate(
                id,
                { name }
            );
            if (!skill) return res.status(404).send('Habilidad no encontrada');
            res.status(201).send('Habilidad actualizada correctamente');
        } catch (error) {
            console.error("Error al actualizar habilidad:", error);
            res.status(500).json({ message: 'Error al actualizar habilidad' });
        }
    };

    static deleteSkill = async (req, res) => {
        const { id } = req.params;
        try {
            const skill = await Skill.findByIdAndDelete(id);
            if (!skill) return res.status(404).send('Habilidad no encontrada');
            res.status(201).send('Habilidad eliminada correctamente');
        } catch (error) {
            console.error("Error al eliminar habilidad:", error);
            res.status(500).json({ message: 'Error al eliminar habilidad' });
        }
    };
}
