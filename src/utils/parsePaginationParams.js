
const parseNumber = (number, defaultValue) => {  // Функція parseNumber призначена для перетворення рядкових значень в числа
    const isString = typeof number === 'string';        // typeof number — повертає тип змінної number у вигляді рядка
    if (!isString) return defaultValue;                 // Якщо змінна не строка то повертається дефолтне значення

    const parsedNumber = parseInt(number);              // parseInt() в JavaScript використовується для перетворення рядка (або іншого значення) на ціле число

    if (Number.isNaN(parsedNumber)) {                   // Якщо значення NaN повертається дефолтне значення
        return defaultValue;
    }

    return parsedNumber;                                // У всіх інших випадках повертається значення передане користувачем
};

export const parsePaginationParams = (query) => { // Парсинг параметрів пагінації (page та perPage) з запиту.
    const { page, perPage } = query;                    // Деконструкція запиту з отриманням значень

    const parsedPage = parseNumber(page, 1);            // Перевірка та передача значень сторіки
    const parsedPerPage = parseNumber(perPage, 10);     // Перевірка та передача значень документів на сторінці    

    return {                                            // Обєкт з значеннями сторінки та кількості документів на сторінку
        page: parsedPage,
        perPage: parsedPerPage,
    };
};