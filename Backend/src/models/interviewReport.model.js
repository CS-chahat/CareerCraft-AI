const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        default: ""
    },
    intention: {
        type: String,
        default: ""
    },
    answer: {
        type: String,
        default: ""
    }
}, {
    _id: false
});

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        default: ""
    },
    intention: {
        type: String,
        default: ""
    },
    answer: {
        type: String,
        default: ""
    }
}, {
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        default: ""
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high", ""],
        default: "medium"
    }
}, {
    _id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        default: 1
    },
    focus: {
        type: String,
        default: "General Technical Prep"
    },
    tasks: {
        type: [String],
        default: []
    }
}, {
    _id: false 
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
        default: ""
    },
    selfDescription: {
        type: String,
        default: ""
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    technicalQuestions: {
        type: [technicalQuestionSchema],
        default: []
    },
    behavioralQuestions: {
        type: [behavioralQuestionSchema],
        default: []
    },
    skillGaps: {
        type: [skillGapSchema],
        default: []
    },
    preparationPlan: {
        type: [preparationPlanSchema],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        default: "Custom Interview Strategy Plan" // Guard option in case AI skips the key
    },
    // 🚀 CRITICAL FIX: Registered missing field in strict schema layer to prevent 500 runtime crash
    resumeHtml: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const interviewReportModel = mongoose.model("interviewReports", interviewReportSchema);
module.exports = interviewReportModel;