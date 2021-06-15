const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const port = 8001;
const todoList = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser('my secret here'));
app.use(cookieSession({ secret: 'manny is cool' }));

const authMiddleware = (req, res, next) => {
  if (!req.session.authenticated) {
    return res.redirect('/login');
  }
  next();
};

app.get('/', authMiddleware, (req, res) => res.redirect('/main'));

app.get('/login', (req, res) => {
  res.send(`
    <html>
      <body>
        <form action="/auth" method="post">
          <input type="text" name="account" placeholder="Account">
          <input type="password" name="password" placeholder="Password">
          <input type="submit" value="login">
        </form>
      </body>
    </html>
  `);
});

app.get('/main', authMiddleware, (req, res) => {
  const list = todoList.reduce((todos, todo) => {
    todos += `
      <li>${todo}</li>
    `;
    return todos;
  }, '');
  res.send(`
    <html>
      <body>
        <h1>TODOs</h1>
        <hr />
        <ul>${list}</ul>
        <hr />
        <form action="/todo" method="post">
          <input type="text" name="todo" placeholder="enter todo here">
          <input type="submit" value="add">
        </form>
        <hr />
        <form action="/logout" method="post">
          <input type="submit" value="logout">
        </form>
      </body>
    </html>
  `);
});

app.post('/auth', (req, res) => {
  if (req.body.account === 'test' && req.body.password === 'test') {
    req.session.authenticated = true;
    res.redirect('/main');
  } else {
    res.redirect('/login');
  }
});

app.post('/todo', authMiddleware, (req, res) => {
  if (req.body.todo) {
    todoList.push(req.body.todo);
  }
  res.redirect('/main');
});

app.post('/logout', (req, res) => {
  delete req.session.authenticated;
  res.redirect('/login');
});

app.get('*', (req, res, next) => {
  res.status(404).end('404 Not Found');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
