import createHttpError from 'http-errors';

export const validateBody = (schema) => async(req, res, next) => {
    try {
        await schema.validateAsync(req.body, { // Це асинхронний метод, який перевіряє дані (req.body) на відповідність схемі. Він повертає Promise, тому використовується await.
            abortEarly: false,                 // Опція, яка вказує, що валідатор має перевіряти всі поля перед поверненням помилок, а не зупинятися на першій помилці. 
        });
        next();
    } catch (err) {
        const error = createHttpError(400, `Поганий запит`, {
            errors: err.details,
        });
        next(error);
    }
};