import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => { // Функція з аргументом порядку сортування
    const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder); // Метод .includes() у JavaScript — це вбудована функція для масивів (Array) та рядків (String), яка перевіряє, чи міститься певний елемент або підрядок у об'єкті. Повертає true або false.
  
    if (isKnownOrder) return sortOrder; // Якщо true то повернути заданий sortOrder.
  
    return SORT_ORDER.ASC;              // Дефолтний вид сортування
};

const parseSortBy = (sortBy) => { // Функція з аргументом виду сортування
    const keysOfStudent = [       // Види сортування які можливі відносно нашої схеми
        '_id',
        'name',
        'age',
        'gender',
        'avgMark',
        'onDuty',
        'createdAt',
        'updatedAt',
    ];

    if (keysOfStudent.includes(sortBy)) { // Якщо змінна видів сортування має наданий вид сортування то повернути його 
        return sortBy;                    
    }

    return '_id';                         // Інакше повернути сортування по ід
};

export const parseSortParams = (query) => { // З запиту ми отримуємо параметри сортування SOrtOrder та sortBy 
    const { sortOrder, sortBy } = query;    // Деконструюємо

    const parsedSortOrder = parseSortOrder(sortOrder);  // Проводимо перевірку та запис порядку сортування
    const parsedSortBy = parseSortBy(sortBy);           // Проводимо перевірку та запи виду сортування

    return {                                            // Повертаємо обєкт ключ значення з порядком та видом сортування
        sortOrder: parsedSortOrder,
        sortBy: parsedSortBy,
    };
};