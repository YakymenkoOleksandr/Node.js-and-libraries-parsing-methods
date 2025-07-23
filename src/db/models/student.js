import { model, Schema } from 'mongoose'; // Імпортуємо метод схему з Mongoose. 

const studentsSchema = new Schema( // Створюємо нову схему 
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    avgMark: {
      type: Number,
      required: true,
    },
    onDuty: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // timestamps — встановлює значення true, щоб автоматично створювати поля createdAt та updatedAt, які вказують на час створення та оновлення документа.
    versionKey: false, // versionKey — вказує, чи має бути створене поле __v для відстеження версій документу. У нашому випадку ми встановлюємо false, щоб це поле не створювалося.
  },
);

export const StudentsCollection = model('students', studentsSchema); // Маючи схему створюємо модель, в яку передаємо назву колекції та схему