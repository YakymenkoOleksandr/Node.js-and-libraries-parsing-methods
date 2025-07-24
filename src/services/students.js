import { StudentsCollection } from '../db/models/student.js';
/*Сервіси потрібні для взаємодії з БД за допомогою mongoose*/

export const getAllStudents = async () => {         // Асинхронна функція 
  const students = await StudentsCollection.find(); // Асинхронний запит методом .find() на пошук всіх документів
  return students;                                  // Поверає всі наявні документи, якщо є
};

export const getStudentById = async (studentId) => {              // Асинхронна функція
    const student = await StudentsCollection.findById(studentId); // Асинхронний запит методом .findByID(someId) на пошук одного
    return student;                                               // Пвернення конкретного результату
};

export const createStudent = async (payload) => {     // Асинхронна функція
  const student = StudentsCollection.create(payload); // Асинхронний запит методом Schema.create(data)
  return student;                                     // Створює новий документ з переданими данними
};