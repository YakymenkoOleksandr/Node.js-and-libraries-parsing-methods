import { Router } from 'express';                                   // Метод для організації роутингу в експрес
import { ctrlWrapper } from '../utils/ctrlWrapper.js';              // Імпортуємо try/catch обгортку
import { validateBody } from '../middlewares/validateBody.js';      // Мідлвара для валідації
import { registerUserSchema } from '../validations/auth.js';        // Схема валідації за допомогою бібліотеки Joi
import { registerUserController } from '../controllers/auth.js';    // Контролер, що містить серверну функцію для валідації
import { loginUserSchema} from '../validation/auth.js';             // Валідція під час логінізації
import { loginUserController } from '../controllers/auth.js';       // Контролер логінізації

const router = Router();                                            // Роутер

router.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));   // Шлях для створення користувача

router.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));            // Шлях для логінізації користувача

