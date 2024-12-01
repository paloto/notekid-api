const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenido a NoteKid Backend');
});

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error conectando a MongoDB:', err));

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Enviar mensaje
    socket.on('sendMessage', async (data) => {
        const { chatId, senderId, content } = data;
        const message = await Message.create({ chatId, senderId, content });
        io.to(chatId).emit('newMessage', message);
    });

    // Unirse a un chat
    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`Usuario ${socket.id} se unió al chat ${chatId}`);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor NoteKid corriendo en el puerto ${PORT}`);
});
