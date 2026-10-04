@echo off
chcp 65001 > nul
title Website Chúc Mừng Sinh Nhật 💌

:: Chuyển đúng thư mục chứa file bat
cd /d "%~dp0"

:: Tự động thêm đường dẫn Node.js vào PATH phiên làm việc này nếu chưa có
if exist "C:\Program Files\nodejs\node.exe" (
    set "PATH=C:\Program Files\nodejs;%PATH%"
)
if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set "PATH=C:\Program Files (x86)\nodejs;%PATH%"
)

echo =========================================================
echo    💌 ĐANG KHỞI ĐỘNG WEBSITE CHÚC MỪNG SINH NHẬT 💌
echo =========================================================
echo.

:: Kiểm tra Node.js
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Đã kết nối Node.js thành công!
    if not exist node_modules (
        echo [INFO] Đang tải các gói cần thiết (lần đầu)...
        call npm install
    )
    echo [INFO] Đang mở trình duyệt tại http://localhost:3000 ...
    start "" cmd /c "timeout /t 1 /nobreak >nul && start http://localhost:3000"
    node server.js
    goto end
)

:: Nếu chưa tìm thấy Node.js, thử bằng Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Đang khởi chạy website bằng Python...
    start "" cmd /c "timeout /t 1 /nobreak >nul && start http://localhost:3000"
    python -m http.server 3000 --directory public
    goto end
)

:: Nếu không, mở trực tiếp index.html
echo [INFO] Đang mở trực tiếp giao diện website...
start "" "%~dp0public\index.html"

:end
pause
