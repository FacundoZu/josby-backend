import User from "../models/User.js";
import Service from "../models/Service.js";

export class FreelancerController {

    static getFreelancers = async (req, res) => {
        try {
            const { search, category } = req.query;

            const queryFilter = { role: "freelancer" };

            if (search) {
                const regex = new RegExp(search, "i");
                queryFilter.$or = [
                    { firstname: regex },
                    { lastname: regex },
                    { location: regex }
                ];
            }

            const freelancers = await User.find(queryFilter)
                .select("-password -role -createdAt -updatedAt -__v")
                .lean();

            if (freelancers.length === 0) {
                return res.status(404).json({ message: "No se encontraron freelancers" });
            }

            const freelancerIds = freelancers.map(f => f._id);

            const serviceFilter = {
                usuarioId: { $in: freelancerIds }
            };

            if (category && category !== "") {
                serviceFilter.categories = category;
            }

            const services = await Service.find(serviceFilter).lean();

            const response = freelancers.map(f => ({
                ...f,
                services: services.filter(s => s.usuarioId.toString() === f._id.toString())
            }));

            res.status(200).json(response);

        } catch (error) {
            console.error("Error al obtener freelancers:", error);
            res.status(500).json({ error: error.message });
        }
    };


}
