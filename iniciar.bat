@echo off
title Mapa Interativo - Inicializando...

cd /d "%~dp0"

echo ==========================================
echo      MAPA INTERATIVO - INICIALIZANDO
echo ==========================================
echo.

where py >nul 2>&1
if %errorlevel%==0 (
    start "" http://localhost:8000
    py -m http.server 8000
    goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
    start "" http://localhost:8000
    python -m http.server 8000
    goto :eof
)

echo.
echo ERRO: Python nao foi encontrado neste computador.
echo.
echo Instale o Python em:
echo https://www.python.org/downloads/
echo.
echo Durante a instalacao marque a opcao:
echo    Add Python to PATH
echo.
pause