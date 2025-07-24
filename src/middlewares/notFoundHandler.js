
export const notFoundHendler = (req, res, next) => {
    res.status(404).json({
        message: "Маршрут не знайдено."
    });
};