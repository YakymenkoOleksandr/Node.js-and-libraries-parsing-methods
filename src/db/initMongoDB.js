import mongoose from 'mongoose'; // Бібліотека для роботи з MongoDB
import { getEnvVar } from '../utils/getEnvVar.js'; // Імпорт функції для отримання секретних змінних
export const initMongoDB = async () => {
    try {
        const user = getEnvVar('MONGODB_USER');
        const pwd = getEnvVar('MONGODB_PASSWORD');
        const url = getEnvVar('MONGODB_URL');
        const db = getEnvVar('MONGODB_DB');

        await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`); 
        /*Реалізація асинхронної функції для підключення серверу до бази данних. Важливу роль в mongoose відіграє метод connect 
        в який ми передаємо помилання з нашого MongoDB Atlas. Для того щоб підключення відбувалося, функцію потрібно викликати в
        index.js  */
    console.log('Mongo connection successfully established!'); // Повідомлення про вдале підключення
  } catch (e) {
    console.log('Error while setting up mongo connection', e); // Повідомлення про невдале підключення
    throw e;
  }
};
