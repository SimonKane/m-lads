import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
    title: { type: String, required: true },   
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "investigating", "resolved", "closed"], default: "open" },
    priority: { type: String, enum: ["critical", "high", "medium", "low"], required: true },
    createdAt: { type: Date, default: Date.now },
    aiAnalysis: {
        type: {
            type: String,
        },
        action: {
            type: String,
            enum: ["restart_service", "scale_up", "clear_cache", "notify_human", "none"],
        },
        target: {
            type: String,
            default: null,
        },
        priority: {
            type: String,
        },
        recommendation: {
            type: String,
        },
    },      

});

export const Incident = mongoose.model('Incident', incidentSchema);
