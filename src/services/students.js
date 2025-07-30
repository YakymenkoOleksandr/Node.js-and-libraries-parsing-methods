import { StudentsCollection } from '../db/models/student.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
/*Сервіси потрібні для взаємодії з БД за допомогою mongoose*/

/*Асинхронні функції (async) і базові методи Mongoose (як find()) завжди потребують await,
інакше замість даних ти отримаєш "обіцянку" (проміс), яку ще треба виконати. */

export const getAllDocumentsStudents = async () => {
  const studentsAll = await StudentsCollection.find();
  return {
    data: studentsAll
  };
};


export const getAllStudents = async ({ page, perPage, sortOrder, sortBy, filter}) => {         // 1. Асинхронна функція 2. Приймає аргументи пагінації 
  const limit = perPage;                                             // Запис в змінну кількості документів на сторінку
  const skip = (page - 1) * perPage;                                 // Кількість документів, яку потрібно пропустити

  const studentsQuery = StudentsCollection.find();                  // Синхронний запит методом .find() на пошук всіх документів. Добуває колекцію студентів
  
  if (filter.gender) {                               
    studentsQuery.where('gender').equals(filter.gender);
  }
  if (filter.maxAge) {
    studentsQuery.where('age').lte(filter.maxAge);
  }
  if (filter.minAge) {
    studentsQuery.where('age').gte(filter.minAge);
  }
  if (filter.maxAvgMark) {
    studentsQuery.where('avgMark').lte(filter.maxAvgMark);
  }
  if (filter.minAvgMark) {
    studentsQuery.where('avgMark').gte(filter.minAvgMark);
  }

  /* .merge(studentsQuery) Що робить: Об'єднує поточний запит з іншим запитом (studentsQuery)
  .countDocuments() Що робить: Виконує запит і повертає кількість документів, що відповідають умовам */
  
  /* Данний код замінюється коли додаються фільта
  const studentsCount = await StudentsCollection.find()                   
    .merge(studentsQuery)                                           
    .countDocuments();                                              
  */
  
  /*.skip(skip) Призначення: Пропускає певну кількість документів у результаті.
    .limit(limit) Призначення: Обмежує кількість документів у відповіді.
    .exec() Призначення: Виконує запит і повертає Promise. */
  
  /* Данний код замінюється коли додаються фільта
  const students = await studentsQuery.skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec(); // Асинхронний запит методом .find() на пошук всіх документів
  */
  
  const [studentsCount, students] = await Promise.all([
    StudentsCollection.find().merge(studentsQuery).countDocuments(), studentsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec(),
  ]);

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  return {
    data: students,
    ...paginationData,
  };                                                   // Поверає всі наявні документи, якщо є
};

export const getStudentById = async (studentId) => {              // Асинхронна функція. studentID це id створений БД для документа
    const student = await StudentsCollection.findById(studentId); // Асинхронний запит методом .findByID(someId) на пошук одного
    return student;                                               // Пвернення конкретного результату
};

export const createStudent = async (payload) => {     // Асинхронна функція. payload данні які відповідають схемі та моделі студента
  const student = await StudentsCollection.create(payload); // Асинхронний запит методом .create(data)
  return student;                                     // Створює новий документ з переданими данними
};

export const deleteStudent = async (studentId) => {                               // Асинхронна функція для видалення документа
  const student = await StudentsCollection.findOneAndDelete({ _id: studentId });  // // Асинхронний запит методом .findOneAndDelete(filter, options, callback)
  return student;
};

export const upsertStudent = async (studentId, payload, options = {}) => { //Асинхронна функція що приймає необхідні для .findOneAndUpdate() методу аргументи
  const rawResult = await StudentsCollection.findOneAndUpdate(             //Запис в змінну результату виклику Schema.findOneAndUpdate() методу mongoose 
    { _id: studentId },                                                    //Передача необхідних методу  .findOneAndUpdate() аргументів. Тут query
    payload,                                                               //Тут update, 
    {                                                                      //Тут options,
      new: true,                                                           //Повертає оновлений документ (не старий) 
      includeResultMetadata: true,                                         //Додає метадані про операцію (наприклад, чи був upsert)
      ...options,                                                          //Дозволяє передати додаткові опції
    },
  );

  if (!rawResult || !rawResult.value) return null;                         //Якщо документ не знайдено і не створено через upsert — поверни null 

  return {                                                                 
    student: rawResult.value,                                              //У випадку успіху повертається нове значення студента
    isNew: Boolean(rawResult?.lastErorrObject?.upserted),                  //Ось це поясни не зовсім розумію як це працює.   
  };
};

/*Метод findOneAndUpdate у Mongoose повертає спеціальний об'єкт результату, структура якого залежить від параметрів.
Якщо includeResultMetadata: true, результат містить такі поля:
{ value: Document | null,      // Оновлений/створений документ (якщо new: true)
  lastErrorObject: {           // Метадані про операцію
    updatedExisting: boolean,  // Чи був документ оновлений (true) чи створений (false)
    upserted: ObjectId | null  // Якщо був upsert, містить ID нового документа
  },
  // ...інші технічні поля
}

Що таке rawResult.value? value - це безпосередньо документ, який був:
Оновлений (якщо він існував). Створений (якщо upsert: true і документ не знайшли). null (якщо документ не знайшли і upsert: false).  

Як працює isNew: Boolean(rawResult?.lastErrorObject?.upserted)?
Ця логіка визначає, чи був документ створений (а не просто оновлений):
lastErrorObject.upserted: Містить ObjectId нового документа, якщо операція була upsert (тобто документ створився).
null або undefined, якщо документ просто оновився.
Перетворення в Boolean:
Boolean(непусте значення) → true (документ створено).
Boolean(null/undefined) → false (документ оновлено).

Що це за знаки питань rawResult?.lastErorrObject?.upserted ?
Це оператор опціонального ланцюжка (optional chaining) (?.) у JavaScript. Він дозволяє безпечно звертатися до вкладених властивостей об'єкта,
не отримуючи помилки, якщо проміжне посилання дорівнює null або undefined.
*/

export const updateStudent = async (studentId, payload, options = {}) => { //Асинхронна функція що приймає необхідні для .findOneAndUpdate() методу аргументи
  const rawResult = await StudentsCollection.findOneAndUpdate(             //Запис в змінну результату виклику Schema.findOneAndUpdate() методу mongoose 
    { _id: studentId },                                                    //Передача необхідних методу  .findOneAndUpdate() аргументів. Тут query
    payload,                                                               //Тут update, 
    {                                                                      //Тут options,
      new: true,                                                           //Повертає оновлений документ (не старий) 
      includeResultMetadata: true,                                         //Додає метадані про операцію (наприклад, чи був upsert)
      ...options,                                                          //Дозволяє передати додаткові опції
    },
  );

  if (!rawResult || !rawResult.value) return null;                         //Якщо документ не знайдено і не створено через upsert — поверни null 

  return {                                                                 
    student: rawResult.value,                                              //У випадку успіху повертається нове значення студента
    isNew: Boolean(rawResult?.lastErorrObject?.upserted),                  //Ось це поясни не зовсім розумію як це працює.   
  };
};