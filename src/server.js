/*Якщо в index.js файлі ми вказували роути та мідлвари на пряму то в файлі серверу ми створюємо функцію,
яка містить необхідні роути та мідлвари. */

// 1. Встановлюємо необхідні імпорти
import express from 'express'; // Бібліотека доя I/O операцій та маршрутизації
import pino from 'pino-http'; // Бібліотека для логування запитів
import cors from 'cors'; // Бібліотека для встановлення політики CROS
import { getEnvVar } from '../src/utils/getEnvVar.js'; // Функція перетворювач призованих змінних
import { getAllStudents, getStudentById } from './services/students.js'; // Імпортуємо сервісні функції для взаємодії з базами данних

// 2. Задамо порт на якому будемо працювати.
const PORT = Number(getEnvVar("PORT", 3000));
/* Вказуємо на якому порту має працювати наш сервер. Якщо змінна зберігається в засекреченому файлі
то необхідно використовувати process.env.НазваЗмінної для отримання доступу до неї. */

//3. Створюємо функцію серверу.
export const startServer = () => {
  //4. Передаємо у функцію expres
  const app = express(); // Записуємо функцію експрес в змінну
  //5. Передаємо мідлвару парсер JSON
  app.use(express.json); // Це вбудована мідлвара Express, яка: Автоматично парсить JSON-тіло (body) HTTP-запитів і робить його доступним у req.body.
  //6. Встановлюємо правила CROSS
  app.use(cors()); // Це мідлвара для встановлення політики CROS
  //7. Додаємо логер та форматувач.
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
    );
    
  /*Це мідлвара для логування та форматування логів
Мідлвара з бібліотеки pino-http, для читабельного форматування відповідей в консолі.
pino генерує JSON-логи.  transport — спосіб перенаправити потік логів у сторонній "вивід".
target — назва модуля, який обробляє вивід логів. pino-pretty перетворює їх у зручний формат.*/
    
  //8. Додаємо наші роути
  app.use('/', (req, res) => {
    res.json({
      message: 'Халоу хоумі', // Це роут. В нього передається маршрут та колбек в якому аргументи обєкти req та res
    });
  });

  //9. Додаємо перехоплювач помилок зі сторони клієнта
  app.use((req, res, next) => { // В Node.js передача "*" більше не працює, тепер передаютьсятульки req, res i next.
    res.status(404).json({ // Дана мідлвара вказує про некоректність запиту
      message: 'Мам, чесно там його нема.',
    });
  });

  //10. Додаємо перехоплювач помилок зі сторони сервера
  app.use((err, req, res, next) => { // Мідлвара ерор перехоплювач. Мість аргументи в колбекі req, res, next, error що характерно тількия для ерормідлвар.
    res.status(500).json({
      message: 'Да уж, ну хто так сервіси пише.',
      error: err.message,
    });
  });

  //11. Додаємо мідлвару для штампу часу
  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });
  /* Це мідлвара. В неї передається колбек з обєктами аргументами req та res та обовязковим next. 
    Виводить локальний час коли була вчинена та чи інша дія.*/

  //12. Додамо слухач, щоб занти що сервер запущено
  app.listen(PORT, () => { // Вішаємо слухач, який приймає порт та колбек, та виводимо повідомлення.
    console.log(`Сіте із воркінг он порт ${PORT}`);
  });

  //13. Після створення 1. Схеми (new Schema) => 2. Моделі (model("name", nameSchema)) => 3. Сервісу (asycn func + mongoose mathods ) => 4. Створення роуту.
  app.use('/students', async (req, res) => {
    const students = getAllStudents();

    res.status(200).json({
      data: students,
    });
  });

  //14. Після створення 1. Схеми (new Schema) => 2. Моделі (model("name", nameSchema)) => 3. Сервісу (asycn func + mongoose mathods ) => 4. Створення роуту.
  app.use('/students/:studentId', async (req, res, next) => { 
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    if (!student) {
      res.status(404).json({
        message: "Не знаю я такого, не пустю!"
      });
      return;
    }
  
    res.status(200).json({
      data: student,
    });
  
  
  });
};
