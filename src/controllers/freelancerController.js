import User from "../models/User.js";
import Service from "../models/Service.js";

export class FreelancerController {

    static getFreelancers = async (req, res) => {
        try {
            const { search, category, skills, page = 1, limit = 9 } = req.query;

            const freelancerFilter = { role: "freelancer" };

            if (search) {
                const regex = new RegExp(search, "i");
                freelancerFilter.$or = [
                    { firstname: regex },
                    { lastname: regex },
                    { location: regex }
                ];
            }

            if (skills) {
                const skillsArray = skills.split(',').filter(Boolean);
                if (skillsArray.length > 0) {
                    freelancerFilter.skills = { $in: skillsArray };
                }
            }

            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;

            const totalBeforeCategory = await User.countDocuments(freelancerFilter);

            let freelancers = await User.find(freelancerFilter)
                .select("-password -role -birthdate -createdAt -updatedAt -__v")
                .populate("skills", "name")
                .skip(skip)
                .limit(limitNum)
                .lean();

            if (freelancers.length === 0) {
                return res.status(200).json({
                    freelancers: [],
                    pagination: {
                        total: 0,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: 0,
                        hasMore: false
                    }
                });
            }

            if (category) {
                const freelancerIds = freelancers.map(f => f._id);

                const services = await Service.find({
                    usuarioId: { $in: freelancerIds },
                    categories: { $in: [category] }
                }).lean();
                const freelancerIdsWithCategory = services.map(s => s.usuarioId.toString());

                freelancers = freelancers.filter(f =>
                    freelancerIdsWithCategory.includes(f._id.toString())
                );
            }

            let total;
            if (category) {
                const allFreelancers = await User.find(freelancerFilter)
                    .select("_id")
                    .lean();

                const allIds = allFreelancers.map(f => f._id);
                const servicesForCount = await Service.find({
                    usuarioId: { $in: allIds },
                    categories: { $in: [category] }
                }).distinct('usuarioId');

                total = servicesForCount.length;
            } else {
                total = totalBeforeCategory;
            }

            const totalPages = Math.ceil(total / limitNum);
            const hasMore = pageNum < totalPages;

            return res.status(200).json({
                freelancers,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages,
                    hasMore
                }
            });

        } catch (error) {
            console.error("Error al obtener freelancers:", error);
            res.status(500).json({ error: error.message });
        }
    };



}
