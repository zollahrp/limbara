
import { sendChatMessage } from "@/app/service/api";

export const sendMessageToAI = async (message: string) => {
  try {
    return await sendChatMessage(message);
  } catch (error) {
    console.error("Gagal mengirim pesan ke AI:", error);
    throw new Error("Gagal terhubung ke server."); 
  }
};
