const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { db, auth, admin } = require('./firebaseConfig');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const userRouter = require('./src/routes/userRoutes');
const authRouter = require('./src/routes/authRoutes');
const projectRouter = require('./src/routes/projectRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware para habilitar CORS
app.use(cors());
app.use(express.json());

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Token de autenticação ausente' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rotas
app.use('/api/users', authenticateToken, userRouter);
app.use('/api', authRouter);
app.use('/api/projects', projectRouter);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;