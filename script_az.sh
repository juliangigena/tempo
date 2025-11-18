#!/bin/bash

##############################################################################
# Script de Instalación de Docker para Ubuntu 24.04 LTS
# Optimizado para correr 3 contenedores
##############################################################################

set -e  # Salir si hay algún error
sudo apt-get update
sudo apt-get install -y curl

curl -sL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | sudo tee /usr/share/keyrings/microsoft.gpg > /dev/null

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/azure-cli/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/azure-cli.list

sudo apt-get update
sudo apt-get install -y azure-cli
