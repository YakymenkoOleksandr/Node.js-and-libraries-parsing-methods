import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import { logoutUser } from '../services/auth.js';
import { refreshUsersSession } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Успішно зареєстровано користувача.',
    data: user,
  });
};

/*Як це працює?
Коли сервер відправляє відповідь з res.cookie(), браузер автоматично зберігає ці куки. При наступних запитах до сервера
браузер додасть ці куки в заголовок Cookie. Сервер може читати їх через req.cookies (якщо використовується cookie-parser).
Важливі моменти: 
    Безпека:
httpOnly: true запобігає викраденню кук через XSS. Якщо додаток працює через HTTPS, варто додати secure: true (куки тільки через HTTPS).
Для захисту від CSRF можна використовувати sameSite: 'strict' або sameSite: 'lax'.
    Термін дії:
expires задає конкретну дату видалення куки. Альтернатива — maxAge: ONE_DAY (час у мілісекундах). */

export const loginUserController = async (req, res) => {
  const session = loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,                                     // Захищена кука (недоступна через JavaScript)
    expires: new Date(Date.now() + ONE_DAY),            // Термін дії — 1 день
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,                                     // Захищена кука (недоступна через JavaScript)
    expires: new Date(Date.now() + ONE_DAY),            // Термін дії — 1 день
  });

  res.stsatus(200).json({
    status: 200,
    message: 'Логінізація пройшла успішно.',
    data: {
      accessToken: session.accessToken,                  // Токен для авторизації (наприклад, JWT)
    },
  });
};


export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {                            // Якщо в кукісах є сешн ід
        await logoutUser(req.cookies.sessionId);            // Здійснити логаут
    }

    res.clearCokies('sessionId');                           // Очистити кукіс сешн ід
    res.clearCokies('refreshToken');                        // Очистити кукіс рефреш токена

    res.status(204).send();                                 // Відправити відповідь 204
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};