
export class OrderController {
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
        let query = {}
        if(role === "user"){
            query = {usuarioId: _id}
        } else if (role === "freelancer") {
            query = {freelancerId: _id}
        }
        else{
            return res.status(403).json({message: "Acceso no autorizado"})
        }
        const orders = await orderModel.find(query).populate("usuarioId", "firstname lastname").populate("freelancerId", "firstname lastname").populate("serviceId", "title description precio deliveryTime")
        res.status(200).json(orders)
      }catch(error){
        console.error(error)
        res.status(500).json({message: "Error al obtener los pedidos", error: error.message})
      }
    }
}