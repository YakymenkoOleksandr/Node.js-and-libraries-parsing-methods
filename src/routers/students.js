import { Router } from 'express'; // Метод для організації роутингу в експрес
import {
  // Імпортуємо контролери для заміни колбеків та структуризації коду.
  getStudentsController,
  getStudentByIdController,
  createStudentController,
  deleteStudentController,
  upsertStudentController,
  patchStudentController,
  getStudentsControllerWithoutPagination,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; // Імпортуємо try/catch обгортку
import { validateBody } from '../middlewares/validateBody.js'; //Мідлвара для валідації
import { createStudentSchema, updateStudentSchema } from '../validations/students.js'; // Схема створення документа студента та схема оновлення документа студента
import { isValidId } from '../middlewares/isValidId.js'; // Валідатор ід студента
import { authenticate } from '../middlewares/authenticate.js'; // Мідлвара аунтифікації
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';

/*Для організації роутингу виділяється папка з файлами де за допомогою методу Router бібліотеки express будуються роути.
В router передається метод Router(). Замість app. тепер використовуємо router.*/

/*Після розділення раутингу на студентів та юзерів (auth) приберається частина маршруту, а саму students з початку роуту.*/

const router = Router(); // studentsRouter — це екземпляр роутера Express, створений за допомогою функції Router() з пакету express.

// Мідлвара аунтифікації
router.use(authenticate);
/*Реалізація отримання всіх документів студентів без пагінації.*/
router.get('/studentsAll', ctrlWrapper(getStudentsControllerWithoutPagination));

//13. Після створення 1. Схеми (new Schema) => 2. Моделі (model("name", nameSchema)) => 3. Сервісу (asycn func + mongoose mathods ) => 4. Створення роуту.
//13.1 app заміняється на router.
//13.2 Другий аргумент, а саме колбек є і називається контролером. І замінюється на контролер.
//13.3 Обгортка ctrlWrapper це конструкція try/cath, яка пробує виконати функцію контролер, а у випадку невдачі виконує функцію помилки.
router.get('/', checkRoles(ROLES.TEACHER), ctrlWrapper(getStudentsController));

//14. Після створення 1. Схеми (new Schema) => 2. Моделі (model("name", nameSchema)) => 3. Сервісу (asycn func + mongoose mathods ) => 4. Створення роуту.
//14.1 app заміняється на router.
//14.2 Другий аргумент, а саме колбек є і називається контролером. І замінюється на контролер.
router.get('/:studentId', checkRoles(ROLES.TEACHER, ROLES.PARENT), isValidId, ctrlWrapper(getStudentByIdController));

/*15. Патерн створення виглядає приблизно так, створюється заготовка функції контролера, потім створюється сервісна функція,
що взаємодіє з БД, використовуючи методи з бібліотеки mongoose, далі ця сервісна функція передається в роут, що створений за
допомгою бібліотеки express. Сам роут складається з метода router, CRUD метода, який приймає в себе 2 аргументи, маршрут та колбек.*/
router.post('/', checkRoles(ROLES.TEACHER), validateBody(createStudentSchema), ctrlWrapper(createStudentController));

router.delete('/:studentId', checkRoles(ROLES.TEACHER), isValidId, ctrlWrapper(deleteStudentController));

router.put('/:studentId', checkRoles(ROLES.TEACHER), isValidId, validateBody(updateStudentSchema), ctrlWrapper(upsertStudentController));

router.patch('/:studentId', checkRoles(ROLES.TEACHER, ROLES.PARENT), isValidId, validateBody(updateStudentSchema), ctrlWrapper(patchStudentController));

/*Тут ти імпортуєш router, який був експортований як default, але називаєш його studentsRouter, бо він містить маршрути,
пов’язані зі студентами. // А чому тоді імпортується як studentsRouter? Тому що при експорті за замовчуванням 
(export default) ти можеш назвати імпорт будь-яким іменем, яке хочеш. */
export default router; 
