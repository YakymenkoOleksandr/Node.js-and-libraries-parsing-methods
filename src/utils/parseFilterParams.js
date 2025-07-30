const parseGender = (gender) => {
    const isString = typeof gender === 'string';                                // Перевірка чи гендер строка
    if (!isString) return;                                                      // Якщо не строка то вийти з функції
    const isGender = (gender) => ['male', 'female', 'other'].includes(gender);  // Записать гендер в змінну
    if (isGender(gender)) return gender;                                        // Повернути гендер якщо всі перевірки пройдені
};

const parseNumber = (number) => {
    const isString = typeof number === 'string';                                // Паравірка чи число строка
    if (!isString) return;                                                      // Якщо число не строка та вийти з функції

    const parsedNumber = parseInt(number);                                      //  parseInt() перетворює рядок в ціле число, відкидаючи дробову частину.
    if (Number.isNaN(parsedNumber)) {                                           // Якщо число NaN вийти з функції
        return;
    }

    return parsedNumber;                                                        // Повернути отримане число
};

export const parseFilterParams = (query) => {           
    const { gender, maxAge, minAge, maxAvgMark, minAvgMark } = query;           // Деконструюємо параметри з запиту

    const parsedGender = parseGender(gender);                                   // Перевіряємо коректність данних
    const parsedMaxAge = parseNumber(maxAge);
    const parsedMinAge = parseNumber(minAge);
    const parsedMaxAvgMark = parseNumber(maxAvgMark);
    const parsedMinAvgMark = parseNumber(minAvgMark);

    return {                                                                    // Повертаємо обєкт з данними
        gender: parsedGender,
        maxAge: parsedMaxAge,
        minAge: parsedMinAge,
        maxAvgMark: parsedMaxAvgMark,
        minAvgMark: parsedMinAvgMark,
    };
};