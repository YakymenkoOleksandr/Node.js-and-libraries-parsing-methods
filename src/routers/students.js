import { Router } from 'express'; // Метод для організації роутингу в експрес
import {
  // Імпортуємо контролери для заміни колбеків та структуризації коду.
  getStudentsController,
  getStudentByIdController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; // Імпортуємо try/catch обгортку

/*Для організації роутингу виділяється папка з файлами де за допомогою методу Router бібліотеки express будуються роути.
В router передається метод Router(). Замість app. тепер використовуємо router.*/
const router = Router();

//13. Після створення 1. Схеми (new Schema) => 2. Моделі (model("name", nameSchema)) => 3. Сервісу (asycn func + mongoose mathods ) => 4. Створення роуту.
//13.1 app заміняється на router.
//13.2 Другий аргумент, а саме колбек є і називається контролером. І замінюється на контролер.
router.get('/students', ctrlWrapper(getStudentsController));

//14. Після створення 1. Схеми (new Schema) => 2. Моделі (model("name", nameSchema)) => 3. Сервісу (asycn func + mongoose mathods ) => 4. Створення роуту.
//14.1 app заміняється на router.
//14.2 Другий аргумент, а саме колбек є і називається контролером. І замінюється на контролер.
router.get('/students/:studentId', ctrlWrapper(getStudentByIdController));

export default router;
