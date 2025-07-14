// import path from 'node:path'; // Імпортуємо метод path
// import fs from 'node:fs' // Імпортуємо метод fs
import express from 'express';

const app = express(); // Записуємо функцію експрес в змінну
const PORT = 3000; // Вказуємо на якому порту має працювати наш сервер

// Це мідлвара. В неї передається колбек з обєктами аргументами req та res та обовязковим next
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Це вбудована мідлвара Express, яка: Автоматично парсить JSON-тіло (body) HTTP-запитів і робить його доступним у req.body.
 app.use(express.json());

// Це роут. В нього передається маршрут та колбек в якому аргументи обєкти req та res
app.get('/', (req, res) => {
  res.json({
    message: 'Чікі брікі і в дамки.',
  });
});

app.use((req, res, next) => { // В Node.js передача "*" більше не працює, тепер передаютьсятульки req, res i next.
  res.status(404).json({ // Дана мідлвара вказує про некоректність запиту
    message: 'Є брать там нікого нет.',
  });
});

app.use((err, req, res, next) => { // Мідлвара ерор перехоплювач. Мість аргументи в колбекі req, res, next, error що характерно тількия для ерормідлвар.
  res.status(500).json({
    message: 'Ля він упав',
    error: err.message,
  });
});

app.listen(PORT, () => {
  // Вішаємо слухач, який приймає порт та колбек, та виводимо повідомлення.
  console.log(`Ну шо галубчик, сервер паше локально на порту ${PORT}`);
});

/*
// Приклад перевірки роботи проекту
    const message = "Hello, world!";
    console.log(message);
*/

// Приклад роботи з методами path.join() та process.cwd()
/*
    const somePath = path.join('some_folder', 'some_file.txt'); // Створює шлях до файлу
    const pathToWorkDir = path.join(process.cwd()); // Отримуємо шлях до кореневої директорії
    const pathToFile = path.join(pathToWorkDir, 'some_folder', 'some_file.txt'); // Вказуємо шлях 
    console.log(pathToFile);
*/

/* Операції з файлами за допомогою fs
    const fileContent = fs.readFileSync('path_to_file'); // Зчитує файл синхронно
    fs.readFile('path_to_file', (err, fileContent))
*/
