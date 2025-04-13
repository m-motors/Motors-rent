#!/bin/sh

MODEL_NAME="llama2:7b"

# Démarre le serveur en arrière-plan
ollama serve &
OLLAMA_PID=$!

# Attendre que le serveur soit prêt
until curl -s http://localhost:11434 > /dev/null; do
  echo "[INFO] Attente du démarrage de Ollama..."
  sleep 1
done

echo "[INFO] Téléchargement du modèle $MODEL_NAME"
ollama pull $MODEL_NAME

# Attendre que le serveur s'arrête (ça permet de conserver le PID principal)
wait $OLLAMA_PID
