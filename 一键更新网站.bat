@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   留白网站 · 一键更新
echo   正在构建并部署，请稍候（约1-2分钟）...
echo ============================================
echo.
call npx astro build
if errorlevel 1 (
    echo.
    echo [失败] 构建出错，网站未更新。
    echo 常见原因：某个资源 md 文件格式写错了。
    echo 请把上面红色错误信息截图发给 Eric。
    pause
    exit /b 1
)
echo.
echo 构建成功，正在上传到服务器...
call npx wrangler pages deploy dist --project-name=shiji-hub --branch=main
if errorlevel 1 (
    echo.
    echo [失败] 上传出错，网站未更新。
    echo 请把上面错误信息截图发给 Eric。
    pause
    exit /b 1
)
echo.
echo ============================================
echo   完成！网站已更新
echo   访问 https://shiji-hub.pages.dev 查看
echo ============================================
pause
