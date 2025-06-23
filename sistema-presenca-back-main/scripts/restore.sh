#!/bin/bash
# Script para restaurar backup do banco MongoDB
# Uso: ./restore.sh <CAMINHO_PARA_BACKUP>

set -e

if [ -z "$1" ]; then
  echo "Uso: $0 <CAMINHO_PARA_BACKUP>"
  exit 1
fi

BACKUP_PATH="$1"
# Variáveis de conexão (ajuste conforme seu .env ou configuração)
MONGO_URI=${MONGO_URI:-"mongodb://localhost:27017/sistema-presenca"}

mongorestore --uri="$MONGO_URI" --drop "$BACKUP_PATH"

echo "Restauração concluída do backup $BACKUP_PATH"
