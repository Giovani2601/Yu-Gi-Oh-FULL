const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de log
const logFilePath = path.join(__dirname, '..', 'logs', 'access.log'); 

fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

// Função para registrar atividades no log
function logActivity(logType, message, req) {
  const timestamp = new Date().toISOString();
  const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown_ip';

  // Mensagem no formato:  [2050-10-10T01:45:00.123Z] [LOGIN-SUCESSO] IP: ::1 | Login de: natalia@gmail.com
  const logEntry = `[${timestamp}] [${logType}] IP: ${clientIp} | ${message}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error('Erro ao escrever log:', err); 
  });
}

module.exports = logActivity;
