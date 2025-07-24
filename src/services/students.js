import { StudentsCollection } from '../db/models/student.js';
/*Сервіси потрібні для взаємодії з БД за допомогою mongoose*/

export const getAllStudents = async () => {         // Асинхронна функція 
  const students = await StudentsCollection.find(); // Асинхронний запит методом .find() всіх документів
  return students;                                  // ПОверає всі наявні документи, якщо є
};

export const getStudentById = async (studentId) => {              // Асинхронна функція
    const student = await StudentsCollection.findById(studentId); // Пошук в колекції та запис в змінну
    return student;                                               // Пвернення результату
};