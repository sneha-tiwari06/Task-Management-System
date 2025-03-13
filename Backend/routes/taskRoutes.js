const express = require('express');
const Task = require('../models/taskModel');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });
router.post('/', authMiddleware, upload.array('attached_documents', 3), async (req, res) => {
    try {
        console.log("Uploaded Files:", req.files);
        if (!req.files) return res.status(400).json({ error: "No files uploaded" });

        const filePaths = req.files.map(file => file.path);
        const { title, description, status, priority, due_date, assigned_to } = req.body;

        const newTask = new Task({
            title,
            description,
            status,
            priority,
            due_date,
            assigned_to,
            attached_documents: filePaths
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Task creation failed" });
    }
});
router.get('/', authMiddleware, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find().populate('assigned_to', 'email');
        } else {
            tasks = await Task.find({ assigned_to: req.user.id }).populate('assigned_to', 'email');
        }
        res.json(tasks);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.put('/:id', authMiddleware, upload.array('attached_documents', 3), async (req, res) => {
    try {
        const { title, description, status, priority, due_date, assigned_to } = req.body;
        
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        let updatedFiles = task.attached_documents;
        if (req.files.length > 0) {
            task.attached_documents.forEach(file => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            });
            updatedFiles = req.files.map(file => file.path);
        }
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status, priority, due_date, assigned_to, attached_documents: updatedFiles },
            { new: true }
        );

        res.json(updatedTask);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json(err);
    }
});
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        task.attached_documents.forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json(err);
    }
});
router.use('/uploads', express.static('uploads'));

module.exports = router;
