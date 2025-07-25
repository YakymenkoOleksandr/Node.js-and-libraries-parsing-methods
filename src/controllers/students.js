import { createStudent, getAllStudents, getStudentById, deleteStudent, upsertStudent, updateStudent } from '../services/students.js'; // Імпортуємо сервісні функції для взаємодії з базами данних
import createHttpError from 'http-errors'; // Спеціальна бібліотека для створення повідомлень помилок
/*Контролери це функції, які використовуються в роутах та мідлварах на місці колбеку.
Взаємодіють з БД за допомогою сервісів та містьть іншу програмну логіку.*/

export const getStudentsController = async (req, res, next) => {
  try {
    const students = await getAllStudents();
    res.json({
      status: 200,
      message: 'Successfully found students!',
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentByIdController = async (req, res, next) => {
  const { studentId } = req.params; // 
  const student = await getStudentById();

  //1. Звичайна обробка помилки
  /*if (!student) {
    res.status(404).json({
      message: 'Student not found',
    });
    return;
    }*/

  //2. Обробка помилки за допомогою передачі до ерор мідлвари
  /*if (!student) {
    next(new Error('Student not found')); 
    return;                               // Вихід з функції
  }*/

  //3. Обробка помилки за допомогою бібліотеки http-error
  /* throw перериває виконання поточної функції (getStudentByIdController) і передає помилку в Express.
  createHttpError створює об'єкт помилки, який: Має властивість status (404), Є екземпляром класу HttpError
  (важливо для подальшої перевірки instanceof). Express автоматично перехоплює помилку (якщо вона throw або next(err)).
  Потім передає її в найближчий middleware для обробки помилок (у вашому випадку – errorHandler).*/

  if (!student) {                                             // Умова, яка містить перехоплювач
    throw createHttpError(404, 'Student not found');          // Метод що створить помилку та опис до неї
  }
  
  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};


export const createStudentController = async (req, res) => {  // Асинхронна функція
  const student = await createStudent(req.body);              // Викликаємо сервісну функцію створення та передаємо туди данні записуючи результат в змінну
  
  res.json({                                                  // Відповідь, яку поверне сервер
    status: 201,
    message: `Студента успішно створено.`,
    data: student,
  });
};

/*
  Різниця між req.body та req.params у Express.js обумовлена їх призначенням для роботи з різними типами даних у HTTP-запитах.
  1. req.body - для даних тіла запиту. Використовується у createStudentController, бо: Тип запиту: POST (створення ресурсу)
  Призначення: Містить дані, які клієнт відправляє для створення нового студента. Формат: Зазвичай JSON або form-data

  2. req.params - для параметрів шляху. Використовується у deleteStudentController, бо: Тип запиту: DELETE (видалення ресурсу)
  Призначення: Містить ідентифікатор у URL-шляху. Формат: Частина URL (динамічний параметр)
*/

export const deleteStudentController = async (req, res, next) => {  // Асинхронна функція, що є контролером
  const { studentId } = req.params;                                 // Це аналогічно до: "Витягни властивість studentId з об’єкта req.params і присвой її однойменній змінній".
                                                                    // Спосіб з деструктуризацією: const { studentId } = req.params; Звичайний спосіб (без деструктуризації): const studentId = req.params.studentId;
  const student = await deleteStudent(studentId);                   // Виконання сервісної функції з записом її результату в змінну

  if (!student) {                                                   // Умова при якій виникає помилка
    next(createHttpError(404, `Студента не знайдено.`));            // Створення звіту про помилку 
    return;
  }

  res.status(204).send();                                           // Створення звіту про успішне виконання функції
};

export const upsertStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const result = await upsertStudent(studentId, req.body, { upsert: true });

  if (!result) {
    next(createHttpError(404, 'Студента не знайдено.'));
    return;
  }
  
  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Картка студента оновлена успішно.`,
    data: result.student,
  });
};

export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const result = await updateStudent(studentId, req.body);

  if (!result) {
    next(createHttpError(404, `Студента не знайдено`));
  }

  res.json({
    status: 200,
    message: `Картка студента успішно оновлена.`,
    data: result.student,
  });
};
