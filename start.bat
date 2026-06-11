@echo off
title GemaApp v1.0 - Actualización y Despliegue en Producción
color 0A

:: 1. Ir a la carpeta donde clonaste el proyecto (Modifica esta ruta por la tuya real)
cd /d "C:\Users\panic\Documents\GitHub\gema-app"

echo ======================================================
echo           ACTUALIZANDO PROYECTO DESDE MASTER        
echo ======================================================
echo.

:: 2. Actualiza el repositorio sin sobrescribir cambios locales
echo [1/3] Conectando con el repositorio remoto...
git fetch origin master
git switch master
if errorlevel 1 (
  echo ERROR: No se pudo cambiar a la rama master.
  pause
  exit /b 1
)
git pull --ff-only origin master
if errorlevel 1 (
  echo ERROR: No se pudo actualizar el repositorio. Revisa conflictos o la rama remota.
  pause
  exit /b 1
)

if not exist ".env.production" (
  echo ERROR: No existe el archivo .env.production.
  echo Copia .env.production.example a .env.production y configura DATABASE_URL.
  pause
  exit /b 1
)

setlocal enabledelayedexpansion
set "DATABASE_URL="
for /f "usebackq tokens=1* delims==" %%A in (`findstr /r "^DATABASE_URL=" .env.production`) do (
  if /I "%%A"=="DATABASE_URL" set "DATABASE_URL=%%B"
)
if not defined DATABASE_URL (
  echo ERROR: No se encontró DATABASE_URL en .env.production.
  echo Asegúrate de que exista una línea como:
  echo DATABASE_URL="mysql://root:root@host.docker.internal:3306/gema"
  pause
  exit /b 1
)
set "DATABASE_URL=!DATABASE_URL:"=!"
for /f "tokens=2 delims=@" %%A in ("!DATABASE_URL!") do set "DB_HOST_PORT=%%A"
for /f "tokens=1 delims=:/" %%A in ("!DB_HOST_PORT!") do set "DB_HOST=%%A"
if not defined DB_HOST (
  echo ERROR: No se pudo parsear el host de DATABASE_URL.
  pause
  exit /b 1
)
if /I "!DB_HOST!"=="localhost" (
  echo ERROR: DATABASE_URL no debe usar localhost cuando se ejecuta dentro de Docker.
  echo Usa host.docker.internal para conectar al MySQL del equipo host.
  pause
  exit /b 1
)
if /I "!DB_HOST!"=="host.docker.internal" (
  echo [VALIDACION] Probando conectividad a host.docker.internal...
  ping -n 1 host.docker.internal >nul 2>&1
  if errorlevel 1 (
    echo ERROR: host.docker.internal no responde. Asegura que Docker Desktop está ejecutándose y que la opción "Exponer daemon en tcp://localhost:2375" no es necesaria.
    pause
    exit /b 1
  )
)
endlocal

echo.
echo ======================================================
echo           RECONSTRUYENDO E INICIANDO DOCKER           
echo ======================================================
echo.

:: 3. Levanta los contenedores usando la configuración de producción
echo [2/3] Verificando cambios en el proyecto...
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build --remove-orphans
if errorlevel 1 (
  echo ERROR: Docker Compose falló al iniciar.
  pause
  exit /b 1
)

echo.
echo ======================================================
echo   ¡PROYECTO EN EJECUCIÓN EXITOSAMENTE EN PRODUCCIÓN!
echo   Puedes acceder en: http://localhost:3000
echo ======================================================
echo.

:: 4. Limpieza en segundo plano para que no se tranque la terminal en Windows
echo [3/3] Liberando espacio en disco en segundo plano...
start /b docker image prune -af --filter "until=24h"

pause