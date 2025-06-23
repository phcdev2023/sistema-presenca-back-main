#!/bin/bash
# Script para backup completo do banco MongoDB
# Uso: ./backup.sh <NOME_DO_ARQUIVO_OPCIONAL>

set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME=${1:-backup_$DATE}

mkdir -p "$BACKUP_DIR"

# Variáveis de conexão (ajuste conforme seu .env ou configuração)
MONGO_URI=${MONGO_URI:-"mongodb://localhost:27017/sistema-presenca"}

mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$FILENAME"

echo "Backup realizado em $BACKUP_DIR/$FILENAME"
