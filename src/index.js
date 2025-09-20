require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/quizzes', async (req, res) => {
    const { name, author, questions } = req.body;

    if (!name || !author || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Invalid request payload' });
    }

    const { data, error } = await supabase
        .from('quizzes')
        .insert([{ name, author, questions }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
});

// Эндпоинт для получения всех квизов
app.get('/quizzes', async (req, res) => {
    const { data, error } = await supabase
        .from('quizzes')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

// Эндпоинт для получения деталей квиза по ID
app.get('/quizzes/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(data);
});

// Эндпоинт для обновления квиза
app.put('/quizzes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, author, questions } = req.body;

    if (!name || !author || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Invalid request payload' });
    }

    const { data, error } = await supabase
        .from('quizzes')
        .update({ name, author, questions })
        .eq('id', id)
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(data);
});

// Эндпоинт для аутентификации
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, username: user.username });
    } else {
        res.status(401).json({ success: false, message: 'Некорректный логин или пароль' });
    }
});

// Эндпоинт для удаления квиза
app.delete('/quizzes/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Quiz deleted successfully' });
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});

module.exports = app;