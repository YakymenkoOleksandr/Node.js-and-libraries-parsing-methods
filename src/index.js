import path from 'node:path'; // Імпортуємо метод 


const message = "Hello, world!";
console.log(message);

const somePath = path.join('some_folder', 'some_file.txt');

const pathToWorkDir = path.join(process.cwd());

const pathToFile = path.join(pathToWorkDir, somePath);

console.log(pathToFile);

