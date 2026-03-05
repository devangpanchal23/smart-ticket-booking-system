require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { ClerkExpressRequireAuth, users } = require('@clerk/clerk-sdk-node');

// 1. Initialize Firebase Admin using the provided Service Account
const serviceAccount = require('./firebase-service-account.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const app = express();
app.use(cors());

// Health Check
app.get('/api/health', (req, res) => res.send('Server is running'));

// 2. Endpoint to Mint Firebase Token based on Clerk Session
// ClerkExpressRequireAuth() securely validates the auth token sent by the Angular frontend
app.get('/api/auth/firebase-token', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const userId = req.auth.userId;

        // Fetch user from Clerk to embed email as a custom claim for Firestore rules
        const user = await users.getUser(userId);

        let primaryEmail = '';
        if (user.emailAddresses && user.emailAddresses.length > 0) {
            const primaryObj = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId);
            primaryEmail = primaryObj ? primaryObj.emailAddress : user.emailAddresses[0].emailAddress;
        }

        const additionalClaims = {
            email: primaryEmail,
            role: user.publicMetadata?.role || 'user'
        };

        // Mint custom Firebase token valid for 1 hour
        const firebaseToken = await admin.auth().createCustomToken(userId, additionalClaims);

        res.json({ firebaseToken });
    } catch (error) {
        console.error('Error minting Firebase token:', error);
        res.status(500).json({ error: 'Failed to mint Firebase token' });
    }
});

// Error Handling Middleware logic
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).json({ error: 'Unauthenticated or Invalid Clerk Token!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Company-Level Firebase Auth Backend running on http://localhost:${PORT}`);
});
