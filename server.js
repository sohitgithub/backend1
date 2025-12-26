const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./db');
const bcrypt = require('bcryptjs');

// --- ROUTE IMPORTS ---
const authRoutes = require('./routes/authRoutes');
const quarterlyRoutes = require('./routes/quarterlyRoutes');
const annualCompanyRoutes = require('./routes/annualCompanyRoutes');
const annualSubsidiariesRoutes = require('./routes/annualSubsidiariesRoutes');
const annualGroupRoutes = require('./routes/annualGroupRoutes');
const boardMemberRoutes = require('./routes/boardMemberRoutes');
const committeeRoutes = require('./routes/committeeRoutes');
const policyRoutes = require('./routes/policyRoutes');
const offerDocumentRoutes = require('./routes/offerDocumentRoutes');
const shareholdingPatternRoutes = require('./routes/shareholdingPatternRoutes');
const secretarialComplianceRoutes = require('./routes/secretarialComplianceRoutes');
const materialCreditorsRoutes = require('./routes/materialCreditorsRoutes');
const industryReportRoutes = require('./routes/industryReportRoutes');
const disclosureRoutes = require('./routes/disclosureRoutes');

dotenv.config();
const app = express();

// --- GLOBAL MIDDLEWARE ---
// ✅ Increase Body Parser Limits for Large Files (200MB)
app.use(express.json({ limit: '200mb' })); 
app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.use(cors({
    origin: [
        'http://localhost:5173',   
        'http://127.0.0.1:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// --- STATIC FOLDER (Crucial for Images/PDFs) ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MOUNT API ROUTES ---
app.use('/api/auth', authRoutes); // Login Route
app.use('/api/quarterly-results', quarterlyRoutes);
app.use('/api/annual-company', annualCompanyRoutes);
app.use('/api/annual-subsidiaries', annualSubsidiariesRoutes);
app.use('/api/annual-group', annualGroupRoutes);
app.use('/api/board-members', boardMemberRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/offer-documents', offerDocumentRoutes);
app.use('/api/shareholding-patterns', shareholdingPatternRoutes);
app.use('/api/secretarial-compliance', secretarialComplianceRoutes);
app.use('/api/material-creditors', materialCreditorsRoutes);
app.use('/api/industry-reports', industryReportRoutes);
app.use('/api/disclosures', disclosureRoutes);

// --- AUTO-CREATE DEFAULT ADMIN (Runs on Server Start) ---
async function createDefaultAdmin() {
    const adminEmail = "admin@symbiotec.com";
    try {
        // Check if admin exists
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [adminEmail]);
        
        if (rows.length === 0) {
            // If not, create one with password 'admin'
            const hashedPassword = await bcrypt.hash("admin", 10);
            await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', 
            [adminEmail, hashedPassword, 'admin']);
            console.log(`>>> ✅ Admin Account Created: ${adminEmail} (Pass: admin)`);
        } else {
            console.log(`>>> ℹ️ Admin Account Exists: ${adminEmail}`);
        }
    } catch (error) {
        console.error(">>> ❌ DB Init Error:", error.message);
    }
}

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createDefaultAdmin(); // Ensure Admin exists
});