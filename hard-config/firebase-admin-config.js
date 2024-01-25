const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const predefinedEmail = 'admin@example.com';
const predefinedPassword = '123456';

admin.auth().createUser({
  email: predefinedEmail,
  password: predefinedPassword,
})
  .then((userRecord) => {
    console.log('Successfully created new user:', userRecord.uid);
    return admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
  })
  .then(() => {
    console.log('User is now an admin');
  })
  .catch((error) => {
    console.error('Error creating user:', error);
  });
