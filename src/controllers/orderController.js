import orderModel from "../models/order.js"
import serviceModel from "../models/Service.js"

export class OrderController {
    static async createOrder(req, res) {
      try{
        const { serviceId } = req.body
        const clienteId = req.user._id

        const service = await serviceModel.findById(serviceId)

        if(!serviceId){
          return res.status(404).json({message: "Servicio no encontrado"})
        }
        const freelancerId = service.usuarioId
        const diaEntrega = service.deliveryTime
        const fechaCalculada = new Date()
        fechaCalculada.setDate(fechaCalculada.getDate() + diaEntrega)
        const newOrder = await orderModel({
          clienteId,
          freelancerId,
          serviceId,
          fechaEntrega: fechaCalculada,
          precio: service.price,
          estado: 'pendiente',
          entregables: []
        })
        await newOrder.save()
        res.status(201).json({message: "Pedido creado exitosamente", order: newOrder
        })
      }catch(error){
        console.error(error)
        res.status(500).json({message: "Error al crear el pedido", error: error.message})
      }
    }
    static async getOrderById(req, res) {
      try{
        const { id } = req.params
        const order = await orderModel.findById(id)
        if(!order){
          return  res.status(404).json({message: "Pedido no encontrado"})
        }
        res.status(200).json(order)
      }catch(error){
        console.error(error)
        res.status(500).json({message: "Error al obtener el pedido", error: error.message})
      }
    }

    static async getOrderByUser(req, res) {
      try{
        const { role, _id } = req.user
        console.log(role)
        let query = {}
        if(role === "user"){
            query = {clienteId: _id}
        } else if (role === "freelancer") {
            query = {freelancerId: _id}
        }
        else{
            return res.status(403).json({message: "Acceso no autorizado"})
        }
        
        const orders = await orderModel.find(query).populate("clienteId", "firstname lastname").populate("freelancerId", "firstname lastname").populate("serviceId", "title description deliveryTime")
        res.status(200).json(orders)
      }catch(error){
        console.error(error)
        res.status(500).json({message: "Error al obtener los pedidos", error: error.message})
      }
    }
}