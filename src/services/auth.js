import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js'; // Модель створена зі схеми для створення юзера
import bcrypt from 'bcrypt';                            // Бібліотека для криптографії
import { randomBytes } from 'crypto'; // Використовується для генерації криптографічно стійких випадкових даних у вигляді буферу або рядка.
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

export const registerUser = async (payload) => {        // Сервісна функція для реєстрації користувача, яка приймає аргумент (Мабуть це req.body)

    const user = await UsersCollection.findOne({ email: payload.email }); // Запитуємо по моделі чи є хочаб один такий же імейл
    if (user) throw createHttpError(409, "Даний імейл вже використовується."); // Якщо такий імейл є, створюємо помилку.
    

    const encryptedPassword = await bcrypt.hash(payload.password, 10); //Хешування паролю для безпеки

    return await UsersCollection.create({               // Передача обєкта данних для створення юзера та захешованого пароля 
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async (payload) => {

    const user = await UsersCollection.findOne({ email: payload.email });   // Перевіряємо чи є такий імейл в нашій системі
    if (!user) { throw createHttpError(404, "Такого користувача не знайдено"); }; // Якщо нема повертаємо помилку про те, що користувача не знайдено

    const isEqual = await bcrypt.compare(payload.password, user.password); // Перевіряємо захешований пароль користувача та введений пароль що передається нам.
    if (!isEqual) { throw createHttpError(401, "Неавторизовано"); };       // Якщо вони не співпадають повертаємо помилку, про те, що авторизація не успішна

    await SessionsCollection.deleteOne({ userId: user._id, });             // Видаляє існуючу сесію, якщо така існує
    
    const accessToken = randomBytes(30).toString('base64');                // Криптографування акцес та рефреш токенів
    const refreshToken = randomBytes(30).toString('base64');

    return await SessionsCollection.create({                               // Створення нової сесії для юзера з створенням акцес та рефреш токенів та часу їх життя
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
    return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  
  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};