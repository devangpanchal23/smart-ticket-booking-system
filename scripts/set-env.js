const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].trim();
  }
});

const targetPath = path.resolve(__dirname, '../src/environments/environment.ts');

const envFileContent = `export const environment = {
    production: false,
    clerk: {
        publishableKey: '${envVars.CLERK_PUBLISHABLE_KEY}'
    },
    firebase: {
        apiKey: "${envVars.FIREBASE_API_KEY}",
        authDomain: "${envVars.FIREBASE_AUTH_DOMAIN}",
        databaseURL: "${envVars.FIREBASE_DATABASE_URL}",
        projectId: "${envVars.FIREBASE_PROJECT_ID}",
        storageBucket: "${envVars.FIREBASE_STORAGE_BUCKET}",
        messagingSenderId: "${envVars.FIREBASE_MESSAGING_SENDER_ID}",
        appId: "${envVars.FIREBASE_APP_ID}",
        measurementId: "${envVars.FIREBASE_MEASUREMENT_ID}"
    }
};
`;

fs.writeFileSync(targetPath, envFileContent);
console.log(`Output generated at ${targetPath}`);
