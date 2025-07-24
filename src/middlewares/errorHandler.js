/*Помилки слід виносити в окремі файли для обробки певних ситуацій*/
import { HttpError } from 'http-errors'; // Бібліотека для обробки помилок

export const errorHendler = (err, req, res, next) => {  // Функція, що обробляє помилки на сервері

    if (err instanceof HttpError) {                     // Перевіряє, чи є помилка екземпляром HttpError (створеної через createHttpError).
        res.status(err.status).json({                   // Якщо так, вона відправляє JSON-відповідь з:
            status: err.status,                         // status – HTTP-статус помилки (наприклад, 404).
            message: err.name,                          // message – назва помилки (наприклад, "Not Found").
            data: err,                                  // data – сам об'єкт помилки (для додаткової інформації).
        });
        return;                                         // return припиняє подальшу обробку, щоб не виконувався інший код.
    }

    res.status(500).json({                               // Повертає статус 500 та поівдомлення та помилку.
        message: 'Щото пішло не так=(',                  // Виводить повідомлення 
     error: err.message,                                 // Інформація про помилку
    });
};
