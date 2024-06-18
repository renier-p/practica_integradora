import messageModel from "../models/message.model.js";

export default class MessageManager {
    async getMessages() {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error("Error obteniendo los mensajes:", error);
            return error;
        }
    }
    
    async createMessage(message) {
        if (message.user.trim() === '' || message.message.trim() === '') {
            console.warn("El mensaje no puede estar vacío.");
            return null;
        }

        try {
            return await messageModel.create(message);
        } catch (error) {
            console.error("Error creando mensaje:", error);
            return error;
        }
    }

    async deleteAllMessages() {
        try {
            console.log("Borrando mensajes...");
            const result = await messageModel.deleteMany({});
            console.log("Mensajes eliminados:", result);
            return result;
        } catch (error) {
            console.error("Error borrando mensajes:", error);
            return error;
        }
    }
}
