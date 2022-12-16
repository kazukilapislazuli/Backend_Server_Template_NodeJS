const Auth = require('./auth')
const User = require('./user')

exports.routes = async (app, express) => {
    // Use Routes
    // All other routes should redirect to the index.html
    app.use('/api/v1/auth', Auth)
    app.use('/api/v1/user', User)
}
