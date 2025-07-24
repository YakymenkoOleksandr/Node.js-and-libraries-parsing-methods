import { getAllStudents, getStudentById } from '../services/students.js'; // Імпортуємо сервісні функції для взаємодії з базами данних
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

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }
  
  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};
