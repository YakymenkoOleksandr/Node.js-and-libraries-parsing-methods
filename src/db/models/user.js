import { model, Schema } from 'mongoose';           // Імпортуємо методи модеі та схеми
import { ROLES } from '../../constants/index.js';   // Імпортуємо константи користувачів

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [ROLES.TEACHER, ROLES.PARENT],
      default: ROLES.PARENT,
    },
  },
  { timestamps: true, versionKey: false },
);

/*Цей код додає до схеми Mongoose (usersSchema) власний метод toJSON(),
який визначає, як об'єкт користувача буде перетворюватися в JSON при відправці клієнту.
Що робить цей метод? Видаляє поле password з об'єкта перед відправкою клієнту. Забезпечує безпеку:
пароль ніколи не потрапляє у відповідь API.*/

usersSchema.methods.toJSON = function () {
  const obj = this.toObject; //Конвертує документ Mongoose у звичайний об'єкт JavaScript. Без цього отримали б додаткові методи Mongoose (наприклад, .save()), які не потрібні у JSON.
  delete obj.password;       //Видаляє поле password з об'єкта. Навіть якщо пароль зберігається у базі, він не буде включений у відповідь.
  return obj;                //Повертає "очищений" об'єкт без пароля.
};

export const UsersCollection = model('users', usersSchema);