
import axios from 'axios';

export const sendMessageToAI = async (message: string) => {
  try {
    const response = await axios.post('/api/chat', { message });
    
    return response.data.reply;
  } catch (error) {
    console.error("Gagal mengirim pesan ke AI:", error);
    throw new Error("Gagal terhubung ke server."); 
  }
};