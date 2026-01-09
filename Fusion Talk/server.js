const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Use Render/Hosting port OR local port
const PORT = process.env.PORT || 3001;

// Store users with ID, name, and emoji
let users = {};
const emojis = [
  "🙊","👻","🐼","🦄","🐸","🐧","🐯","🐶","🐱","🦋","❤️","🥰","😘","🙈","🐵",
  "🐺","🦝","🐰","🐭","🦒","🐻‍❄️","🐻","🐨","🦭","🐬","🦚","🐥","🐤","🕊️","🧡",
  "🩷","🤎","💜","❤️‍🩹","❣️","💕","💞","💚","💘","🎀","🧸"
];

// ----------------------
// Middleware
// ----------------------
app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload());

// Make uploads folder accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----------------------
// File Upload API
// ----------------------
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFile = req.files.file;
  const uploadPath = path.join(__dirname, 'uploads', uploadedFile.name);

  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send('File upload failed.');
    }

    res.json({
      message: 'File uploaded successfully!',
      originalName: uploadedFile.name,
      url: '/uploads/' + uploadedFile.name
    });
  });
});

// ----------------------
// Socket.io Chat Handling
// ----------------------
io.on('connection', (socket) => {
  // When user joins
  socket.on('join', (username) => {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    users[socket.id] = {
      id: socket.id,
      name: username,
      emoji: randomEmoji
    };

    console.log(`✅ User connected: ${username} (${socket.id})`);

    io.emit('userList', Object.values(users));
  });

  // Global chat messages
  socket.on('message', (msg) => {
    if (users[socket.id]) {
      io.emit('chatMessage', {
        id: socket.id,
        name: users[socket.id].name,
        emoji: users[socket.id].emoji,
        msg: msg,
        private: false
      });
    }
  });

  // Private message
  socket.on('privateMessage', (data) => {
    const targetId = data.targetId;
    const msg = data.msg;

    if (users[socket.id]) {
      io.to(targetId).emit('chatMessage', {
        id: socket.id,
        name: users[socket.id].name,
        emoji: users[socket.id].emoji,
        msg: msg,
        private: true
      });
    }
  });

  // File shared
  socket.on('fileShared', (data) => {
    if (users[socket.id]) {
      io.emit('chatMessage', {
        id: socket.id,
        name: users[socket.id].name,
        emoji: users[socket.id].emoji,
        msg: `<a href="${data.url}" target="_blank">${data.originalName}</a>`,
        private: false
      });
    }
  });

  // User disconnect
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      console.log(`❌ User disconnected: ${users[socket.id].name} (${socket.id})`);
      delete users[socket.id];
      io.emit('userList', Object.values(users));
    }
  });
});

// ----------------------
// Start Server
// ----------------------
http.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
