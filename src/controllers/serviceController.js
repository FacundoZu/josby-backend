import Service from "../models/Service"
import User from "../models/User"
import { uploadToCloudinary } from "../utils/uploadImage"

export class ServiceController {
    static getServices = async (_req, res) => {
        try{
            const services = await Service.find()
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

    //Crea el servicio y termina de completar los datos del usuario
    //TODO: cambiar el rol del usuario a "freelancer"
    //TODO: testear el controlador
    static createService = async (req, res) => {
        try {
            const userId = req.user.id
            const files = req.images

            if (!files || files.length === 0) {
                res.status(400).json({message: "Debes subir al menos una imagen"})
                return
            }

            const uploadPromises = files.map(file => uploadToCloudinary(file.buffer))

            //Espera a que todas las fotos se suban
            const uploadResults = await Promise.all(uploadPromises)

            const imageUrls = uploadResults.map(result => result.secure_url)

            const { 
                title, description, deliveryTime, price, categories, 
                title: userTitle, description: userDescription, location, skills 
            } = req.body

            const serviceData = {
                title,
                description,
                deliveryTime,
                price,
                categories,
                images: imageUrls,
                usuarioId: userId
            }

            const newService = new serviceModel(serviceData)
            const savedService = await newService.save()

            const userData = {
                title: userTitle,
                description: userDescription,
                location,
                skills
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