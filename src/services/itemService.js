// Importamos los modelos necesarios desde la carpeta models
const { WorkOrder, Item } = require('../models');

class ItemService {

    // Método para crear un nuevo ítem asociado a una orden de trabajo
    async createNewItem(itemData) {
        const { type, description, count, unitValue, work_order_id } = itemData;

        const workOrder = await WorkOrder.findByPk(work_order_id);

        if (!workOrder) {
            const error = new Error('No se puede crear el ítem: La orden de trabajo especificada no es válida o no existe.');
            error.statusCode = 404;
            throw error;
        }

        const newItem = await Item.create({
            type,
            description,
            count,
            unitValue,
            work_order_id
        });

        return newItem;
    }

    // Método para eliminar un ítem asociado a una orden de trabajo
    async deleteItem(itemData) {
        const { itemId, work_order_id } = itemData;

        const workOrder = await WorkOrder.findByPk(work_order_id);

        if (!workOrder) {
            const error = new Error('No se puede eliminar el ítem: La orden de trabajo especificada no es válida o no existe.');
            error.statusCode = 404;
            throw error;
        }

        const item = await Item.findByPk(itemId);

        if (!item) {
            const error = new Error('No se puede eliminar el ítem: El ítem especificado no existe.');
            error.statusCode = 404;
            throw error;
        }
        
        await item.destroy();

        return { message: 'Ítem eliminado correctamente' };
    }

}

module.exports = new ItemService();