//new
const accountRouter = require('./account')
const adminRouter = require('./admin')
const userRouter = require('./user')
// const regisRouter = require('./regis')
// const uploadRouter = require('./upload')
// const siteRouter = require('./site')

function route(app) { 
    
    // ROUTE login
    app.use('/', accountRouter)
    app.use('/admin', adminRouter)
    app.use('/user', userRouter);
        
}

module.exports = route