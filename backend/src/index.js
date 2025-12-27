require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🔥 OpportunityHub Backend running at http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

const resumeRoutes = require("./routes/resume");
app.use("/resume", resumeRoutes);

