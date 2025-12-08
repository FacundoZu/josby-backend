import orderModel from "../models/order.js";
import serviceModel from "../models/Service.js";
import User from "../models/User.js";
import { sendMail } from "../services/sendEmail.js";

export class OrderController {
  static async createOrder(req, res) {
    try {
      const { serviceId } = req.body;
      const clienteId = req.user._id;

      const service = await serviceModel.findById(serviceId);

      if (!serviceId) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }
      const freelancerId = service.usuarioId;
      const diaEntrega = service.deliveryTime;
      const fechaCalculada = new Date();
      fechaCalculada.setDate(fechaCalculada.getDate() + diaEntrega);
      const newOrder = await orderModel({
        clienteId,
        freelancerId,
        serviceId,
        fechaEntrega: fechaCalculada,
        precio: service.price,
        estado: "pendiente",
        entregables: [],
      });

      const nuevoPedido = await newOrder.save();

      if (nuevoPedido) {
        const freelancer = await User.findById(freelancerId);

        // se envia correo al freelancer
        await sendMail({
          to: freelancer.email,
          subject: "Has recibido un nuevo pedido 🎉",
          html: `
              <h2>¡Hola ${freelancer.firstname}!</h2>
              <p>Te han contratado el servicio: <strong>${
                service.title
              }</strong></p>
              <p>Precio: <strong>$${service.price}</strong></p>
              <p>Entrega estimada: <strong>${fechaCalculada.toLocaleDateString()}</strong></p>
              <p>Revisa tu panel para ver más detalles.</p>
            `,
        });
      }

      res
        .status(201)
        .json({ message: "Pedido creado exitosamente", order: newOrder });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error al crear el pedido", error: error.message });
    }
  }
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await orderModel.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error al obtener el pedido", error: error.message });
    }
  }

  static async getOrderByUser(req, res) {
    try {
      const { role, _id } = req.user;
      const { search, status, page = 1, limit = 9 } = req.query;

      let orderFilter = {};
      if (role === "user") {
        orderFilter = { clienteId: _id };

      } else if (role === "freelancer") {
        orderFilter = { freelancerId: _id };

      } else {
        return res.status(403).json({ message: "Acceso no autorizado" });
      }

      if(status){
        orderFilter.estado = status
      }

      let searchRegex
      if (search) {
        searchRegex = new RegExp(search, "i")
      }

      const pageNum = parseInt(page)
      const limitNum = parseInt(limit)
      const skip = (pageNum - 1) * limitNum

      let orders = await orderModel
        .find(orderFilter)
        .populate("clienteId", "firstname lastname image")
        .populate("freelancerId", "firstname lastname image")
        .populate("serviceId", "title description deliveryTime images")
        .skip(skip)
        .limit(limit)
        .lean()

      if (search) {
        orders = orders.filter(order => {
          const cliente = `${order.clienteId?.firstname} ${order.clienteId?.lastname}`
          const service = order.serviceId?.title || ""

          return searchRegex.test(cliente) || searchRegex.test(service)
        })
      }
      
      let total

      if (search) {
        const allOrders = await orderModel
          .find(orderFilter)
          .populate("clienteId", "firstname lastname")
          .populate("serviceId", "title")
          .lean()

        total = allOrders.filter(order => {
          const cliente = `${order.clienteId?.firstname} ${order.clienteId?.lastname}`
          const service = order.serviceId?.title || "";
          return searchRegex.test(cliente) || searchRegex.test(service)
        }).length
      } else {
        total = await orderModel.countDocuments(orderFilter)
      }

      const totalPages = Math.ceil(total / limitNum)
      const hasMore = pageNum < totalPages

      return res.status(200).json({
        orders,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasMore
        }
      })

    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({
          message: "Error al obtener los pedidos",
          error: error.message,
        });
    }
  }

  static async acceptOrder(req, res){
    try{
      const { id } = req.params

      const acceptedOrder = await orderModel.findByIdAndUpdate(id, {estado: "proceso"}, { new: true })

      if(!acceptedOrder){
        return res.status(404).json({ message: "No se encontró pedido con ese id"})
      }

      res.status(200).json({ message: "Pedido aceptado", order: acceptedOrder})
    }catch(error){
      console.error(error)
      res
        .status(500)
        .json({
          message: "Error al aceptar el pedido",
          error: error.message,
        });
    }
  }

  static async finalizeOrder(req, res){
    try{
      const { id } = req.params

      const acceptedOrder = await orderModel.findByIdAndUpdate(id, {estado: "finalizado"}, { new: true })

      if(!acceptedOrder){
        return res.status(404).json({ message: "No se encontró pedido con ese id"})
      }

      res.status(200).json({ message: "Pedido finalizado", order: acceptedOrder})
    }catch(error){
      console.error(error)
      res
        .status(500)
        .json({
          message: "Error al finalizar el pedido",
          error: error.message,
        });
    }
  }
}
