import Joi from 'joi';                      // Бібліотека для валідації на сервері
import { isValidObjectId } from 'mongoose'; // Метод isValidObjectId з бібліотеки mongoose використовується для перевірки, чи відповідає рядок формату ObjectId в MongoDB.

/*Що таке ObjectId? ObjectId — це спеціальний 12-байтний ідентифікатор, який MongoDB використовує за замовчуванням
 для полів _id у документах. Він має такий формат: 4 байти: час створення (timestamp) 5 байт: випадкове значення (random)
 3 байти: лічильник (incrementing counter). Приклад ObjectId: 507f1f77bcf86cd799439011 */

export const createStudentSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  age: Joi.number().integer().min(6).max(16).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  avgMark: Joi.number().min(2).max(12).required(),
  onDuty: Joi.boolean(),
   parentId: Joi.string().custom((value, helper) => {
		    if (value && !isValidObjectId(value)) {
		      return helper.message('Parent id should be a valid mongo id');
		    }
		    return true;
		 }),
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  age: Joi.number().integer().min(6).max(16),
  gender: Joi.string().valid('male', 'female', 'other'),
  avgMark: Joi.number().min(2).max(12),
  onDuty: Joi.boolean(),
});

