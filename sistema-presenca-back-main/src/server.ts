import App from './app';

const port = process.env.PORT || 3000;
const appInstance = new App();

if (process.env.NODE_ENV !== 'test') {
  console.log('Attempting to connect to DB and initialize services...');
  appInstance.connect().then(() => {
    console.log('Services connected. Starting web server...');
    appInstance.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}
