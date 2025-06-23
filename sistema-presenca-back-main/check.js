console.log('Attempting to import the application...');
try {
  require('./dist/server.js');
  console.log('Application imported successfully.');
} catch (error) {
  console.error('Failed to import application:', error);
  process.exit(1);
}
