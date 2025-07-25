import { startServer } from "../src/server.js";
import { initMongoDB } from "./db/initMongoDB.js";


const startAllSystem = async () => {
    await initMongoDB();    // Додаємо асинхронне підключення бази данних
    startServer();          // Запускаємо сервер
};

startAllSystem();


















// import path from 'node:path'; // Імпортуємо метод path
// import fs from 'node:fs' // Імпортуємо метод fs

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
