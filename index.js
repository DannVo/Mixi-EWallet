const express = require('express');
const cors = require('cors');

// const AccountRouter = require('./controller/AccountRouter');
// const AdminRouter = require('./controller/AdminRouter');
// const UserRouter = require('./controller/UserRouter');
const session = require('express-session');
const app = express();
require('dotenv').config();

app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const route = require('./routers')
const db = require('./config/db')

//Connect to db
db.connect();

app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(cors());

//Route init
route(app);
// app.use('/', AccountRouter);
//app.use('/admin', AdminRouter);
//app.use('/user', UserRouter);


//Listening port
const port = process.env.PORT_OF_WEBSITE || 8080;
app.listen(port, 
    ()=> console.log(`Website is running at http://localhost:${port}`))

//connect moongose and server
// const port = process.env.PORT || 8080;
