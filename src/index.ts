import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
const routes = require('./routes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 2000;

// Set up body parser to convert json body to js object and attach to req
app.use(bodyParser.json());

app.use((req, resp, next) => {
  (process.env.ENVIRONMENT === 'production')
    ? resp.header('Access-Control-Allow-Origin', process.env.ERS_FRONTEND_URL)
    : resp.header('Access-Control-Allow-Origin', `http://localhost:3000`);
  resp.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  resp.header('Access-Control-Allow-Credentials', 'true');
  resp.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
 });

// Logging middleware
app.use((req, res, next) => {
  console.log(`request was made with url: ${req.path}
  and method: ${req.method}`);
  next();
});

// Set up express to attach sessions
const sess = {
  secret: 'ramen',
  cookie: { secure: false },
  resave: false,
  saveUninitialized: false
};
app.use(session(sess));

// Add API routes
app.use(routes);

// Serve html, css, and js
app.use(express.static(path.join(__dirname, '../client/public')));

// Listen on the port
app.listen(PORT);
console.log(`Application started at http://localhost:${PORT}`);