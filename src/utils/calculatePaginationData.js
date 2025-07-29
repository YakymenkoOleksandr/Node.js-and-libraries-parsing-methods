/*Повертає об'єкт з повною інформацією про пагінацію, включно з поточною сторінкою,
кількістю елементів на сторінці, загальною кількістю елементів, загальною кількістю сторінок,
індикаторами наявності наступної та попередньої сторінок. */
export const calculatePaginationData = (count, page, perPage) => { 
    const totalPages = Math.ceil(count / perPage);   // Math.ceil()метод завжди округляє в більшу сторону та повертає найменше ціле число

    const hasNextPage = Boolean(totalPages - page);  // Повертає true якщо значення більше 0

    const hasPreviousPage = page !== 1;              // Повертає true якщо значення сторінки не 1

    return {
        page,               // Сторінка
        perPage,            // Документів на сторінку
        totalItems: count,  // Всього документів
        totalPages,         // Всього сторінок
        hasNextPage,        // Має наступну сторінку
        hasPreviousPage,    // Має попередню сторінку
    };
};