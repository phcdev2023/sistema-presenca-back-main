const { exec } = require('child_process');
const path = require('path');

const backupDir = path.join(__dirname, '../../backups');
const dbName = process.env.MONGO_DB_NAME || 'sistema_presenca';
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/' + dbName;
const dumpDir = path.join(backupDir, dbName);

const command = `mongorestore --uri="${uri}" --drop "${dumpDir}"`;

console.log('Iniciando restore do MongoDB...');
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao restaurar backup: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log('Restore realizado com sucesso do diretório:', dumpDir);
});
