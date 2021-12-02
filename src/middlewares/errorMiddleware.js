export default function errorMiddleware(err, req, res, next) {
    console.log('Error middleware: ', err);
    return res.sendStatus(500);
}
