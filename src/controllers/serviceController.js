import Service from "../models/Service.js"
import User from "../models/User.js"
import Category from "../models/Category.js"
import { uploadToCloudinary } from "../utils/uploadImage.js"

export class ServiceController {
    static getServices = async (req, res) => {
        try{
            const { category } = req.query
            let queryFilter = {}

            if (category && category.trim() !== '') {
            
                const existingCategory = await Category.findOne({
                    name: { $regex: new RegExp(`^${category.trim()}$`, "i") }
                })
               
                if (existingCategory) {
                    queryFilter = { categories: existingCategory._id };
                }
            }

            const services = await Service.find(queryFilter)
                .populate("usuarioId", "firstname lastname location")
                .populate("categories", "name")
                .lean()

            res.status(200).json(services)

        }catch(error){
            console.error("Error al obtener los servicios", error)
            res.status(500).json({message: "Error al obtener los servicios"})
        }
    }

    static getService = async (req, res) => {
        try{
            const { id } = req.params

            if(!id){
                res.status(400).json({message: "El ID del servicio es obligatorio"})
                return
            }

            const service = await Service.findById(id)
                .populate("usuarioId", "id firstname lastname location description title")
                .populate("categories", "name")
                .lean()

            if(!service){
                res.status(404).json({message: "No se enontró el servicio"})
                return
            }

            res.status(200).json(service)

        }catch(error){
            console.error("Error al obtener el servicio", error)
            res.status(500).json({message: "Error al obtener el servicio"})
        }
    }

    static getServiceBySearch = async (req, res) => {
        try{
            const { search } = req.query

            
            const regex = new RegExp(search, 'i')

            const matchedUsers = await User.find({
                $or: [
                    { firstname: regex },
                    { lastname: regex }
                ]
            }).select("_id")

            const matchedUserIds = matchedUsers.map(u => u._id);

            const services = await Service.find({
                $or: [
                    { title: regex },
                    { usuarioId: { $in: matchedUserIds } }
                ]
            })
            .populate("usuarioId", "firstname lastname location")
            .populate("categories", "name")
            .lean()

            res.status(200).json(services)
            
        }catch(error){
            console.error("Error al obtener los servicios", error)
            res.status(500).json({message: "Error al obtener los servicios"})
        }
    }

    //Crea el servicio y termina de completar los datos del usuario
    static createService = async (req, res) => {
        try {
            const userId = req.user.id
            const files = req.files

            if (!files || files.length === 0) {
                res.status(400).json({message: "Debes subir al menos una imagen"})
                return
            }

            const uploadPromises = files.map(file => uploadToCloudinary(file.buffer))

            //Espera a que todas las fotos se suban
            const uploadResults = await Promise.all(uploadPromises)

            const imageUrls = uploadResults.map(result => result.secure_url)

            const { 
                title, description, features, deliveryTime, price, categories, 
                userTitle, userDescription, location, skills 
            } = req.body

            const serviceData = {
                title,
                description,
                features: features.split("\n"),
                deliveryTime,
                price,
                categories,
                images: imageUrls,
                usuarioId: userId
            }

            const newService = new Service(serviceData)
            const savedService = await newService.save()

            const userData = {
                title: userTitle,
                description: userDescription,
                location,
                skills,
                role: "freelancer"
            }

            await User.findByIdAndUpdate(userId, userData, { 
                new: true, 
            })


            res.status(201).json({ 
                message: "Servicio creado correctamente", 
                data: savedService 
            })
            
        }catch(error){
            console.error("Error al crear el servicio", error)
            res.status(500).json({message: "Error al crear el servicio"})
        }
    }

    static updateService = async (req, res) => {
        try{
            const { id } = req.params
            const userId = req.user.id
            const files = req.files
            const { title, description, features, deliveryTime, price, categories } = req.body

            const service = await Service.findById(id)

            if (!service) {
                res.status(404).json({ message: "Servicio no encontrado" })
                return
            }

            if (service.usuarioId.toString() !== userId) {
                res.status(403).json({ message: "No tienes permiso para actualizar este servicio" })
                return
            }
            
            const updateData = {
                title, 
                description,
                features, 
                deliveryTime, 
                price, 
                categories 
            }

            if (files && files.length > 0) {
                
                const uploadPromises = files.map(file => uploadToCloudinary(file.buffer))
                const uploadResults = await Promise.all(uploadPromises)
                
                updateData.images = uploadResults.map(result => result.secure_url)
            }

            const updatedService = await Service.findByIdAndUpdate(
                id,
                updateData, 
                { 
                    new: true, 
                    runValidators: true
                }
            )

            res.status(200).json({ 
                message: "Servicio actualizado correctamente", 
                data: updatedService 
            })

        }catch(error){
            console.error("Error al actualizar el servicio", error)
            res.status(500).json({message: "Error al actualizar el servicio"})
        }
    }

    static deleteService = async (req, res) => {
        try{
            const { id } = req.params

            if(!id){
                res.status(400).json({message: "El ID del servicio es obligatorio"})
                return
            }

            const service = await Service.findByIdAndDelete(id)

            if(!service){
                res.status(404).json({message: "No se encontró el servicio"})
                return
            }

            res.status(201).json({message: "Servicio eliminado correctamente"})

        }catch(error){
            console.error("Error al eliminar el servicio", error)
            res.status(500).json({message: "Error al eliminar el servicio"})
        }
    }
}