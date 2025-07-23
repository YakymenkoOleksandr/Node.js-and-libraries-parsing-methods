import { getAllStudents, getStudentById } from '../services/students'; // Імпортуємо сервісні функції для взаємодії з базами данних
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
  const { studentId } = req.params;
  const student = await getStudentById();

  /*if (!student) { // Звичайна обробка помилки
    res.status(404).json({
      message: 'Student not found',
    });
    return;
    }*/

  if (!student) {
    // Обробка помилки за допомогою передачі до ерор мідлвари
    next(new Error('Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};
