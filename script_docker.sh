#!/bin/bash

##############################################################################
# Script de Instalación de Docker para Ubuntu 24.04 LTS
# Optimizado para correr 3 contenedores
##############################################################################

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

# Función para mostrar mensajes
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[PASO]${NC} $1"
}

# Verificar si se ejecuta como root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "Este script debe ejecutarse como root o con sudo"
        exit 1
    fi
}

# Desinstalar versiones antiguas de Docker (RECOMENDADO)
remove_old_docker() {
    log_step "Eliminando versiones antiguas de Docker si existen..."
    apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    log_info "✓ Limpieza completada"
}

# Actualizar el sistema
update_system() {
    log_step "Actualizando el sistema..."
    apt-get update
    apt-get upgrade -y
}

# Instalar dependencias necesarias
install_dependencies() {
    log_step "Instalando dependencias necesarias..."
    apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        software-properties-common
    log_info "✓ Dependencias instaladas"
}

# Agregar repositorio oficial de Docker
add_docker_repository() {
    log_step "Agregando repositorio oficial de Docker..."
    
    # Crear directorio para keyrings
    install -m 0755 -d /etc/apt/keyrings
    
    # Descargar y agregar clave GPG de Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    # Agregar repositorio de Docker
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update
    log_info "✓ Repositorio agregado"
}

# Instalar Docker Engine
install_docker() {
    log_step "Instalando Docker Engine, CLI y plugins..."
    apt-get install -y \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin
    log_info "✓ Docker instalado correctamente"
}

# Configurar Docker para optimizar recursos (3 contenedores)
configure_docker() {
    log_step "Configurando Docker para uso optimizado..."
    
    # Crear archivo de configuración daemon.json
    mkdir -p /etc/docker
    
    cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  }
}
EOF
    
    log_info "✓ Configuración de Docker optimizada"
}

# Iniciar y habilitar Docker
start_docker() {
    log_step "Iniciando y habilitando Docker..."
    systemctl daemon-reload
    systemctl start docker
    systemctl enable docker
    log_info "✓ Docker iniciado y habilitado en el arranque"
}

# Agregar usuario al grupo docker
setup_user_permissions() {
    if [ -n "$SUDO_USER" ]; then
        log_step "Configurando permisos de usuario..."
        usermod -aG docker $SUDO_USER
        log_info "✓ Usuario $SUDO_USER agregado al grupo docker"
        log_warn "IMPORTANTE: Debes cerrar sesión y volver a entrar para aplicar los cambios"
    fi
}

# Verificar instalación
verify_installation() {
    log_step "Verificando instalación..."
    
    # Verificar versión de Docker
    if docker --version &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        log_info "✓ $DOCKER_VERSION"
    else
        log_error "Error al verificar la versión de Docker"
        exit 1
    fi
    
    # Verificar Docker Compose
    if docker compose version &> /dev/null; then
        COMPOSE_VERSION=$(docker compose version)
        log_info "✓ $COMPOSE_VERSION"
    else
        log_error "Error al verificar Docker Compose"
        exit 1
    fi
    
    # Ejecutar contenedor de prueba
    log_info "Ejecutando contenedor de prueba..."
    if docker run --rm hello-world &> /dev/null; then
        log_info "✓ Contenedor de prueba ejecutado correctamente"
    else
        log_error "Error al ejecutar contenedor de prueba"
        exit 1
    fi
}

# Mostrar resumen final
show_summary() {
    echo ""
    echo "=========================================="
    log_info "¡Instalación completada exitosamente!"
    echo "=========================================="
    echo ""
    log_info "Comandos útiles:"
    echo "  docker ps                    # Ver contenedores activos"
    echo "  docker images                # Ver imágenes descargadas"
    echo "  docker compose up -d         # Levantar contenedores"
    echo "  docker compose down          # Detener contenedores"
    echo "  docker logs <contenedor>     # Ver logs"
    echo ""
    if [ -n "$SUDO_USER" ]; then
        log_warn "Recuerda: Cierra sesión y vuelve a entrar para usar Docker sin sudo"
    fi
    echo ""
}

# Función principal
main() {
    echo ""
    echo "=========================================="
    echo "   Instalador de Docker"
    echo "   Ubuntu 24.04 LTS"
    echo "=========================================="
    echo ""
    
    check_root
    remove_old_docker
    update_system
    install_dependencies
    add_docker_repository
    install_docker
    configure_docker
    start_docker
    setup_user_permissions
    verify_installation
    show_summary
}

# Ejecutar script
main