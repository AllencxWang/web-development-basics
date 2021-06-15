const express = require('express');
const app = express();
const port = 8002;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const token = 'a1b2c3d4';

const todoList = [];

const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).end();
  }
  next();
};

app.get('/', authMiddleware, (req, res) => res.redirect('/main'));

app.post('/api/auth', (req, res) => {
  if (req.body.account === 'test' && req.body.password === 'test') {
    res.json({ token });
  } else {
    res.status(401).end();
  }
});

app.get('/api/list', authMiddleware, (req, res) => {
  res.json({ list: todoList });
});

app.post('/api/list', authMiddleware, (req, res) => {
  if (req.body.todo) {
    todoList.push(req.body.todo);
    res.status(201).end();
  } else {
    res.status(400).end();
  }
});

app.get('*', (req, res, next) => {
  res.status(404).end('404 Not Found');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
