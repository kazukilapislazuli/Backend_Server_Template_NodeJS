const app = require('./server/server')
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} in ${process.env.NODE_ENV} mode`)
})
