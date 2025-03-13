const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    due_date: Date,
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attached_documents: [String],
});
module.exports = mongoose.model('Task', TaskSchema);