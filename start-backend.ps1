# Laval Books - Start Backend
# Automatically kills any process on port 8080 before starting.

$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
$MVN = "C:\Tools\Maven\apache-maven-3.9.6\bin\mvn.cmd"
$POM = "C:\Projects\Capstone new\ebookstore-backend\pom.xml"

# Kill any process already on port 8080
$existing = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Stopping existing process on port 8080..." -ForegroundColor Yellow
    Stop-Process -Id $existing.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "Done." -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting Laval Books backend..." -ForegroundColor Cyan
Write-Host "URL:     http://localhost:8080" -ForegroundColor Green
Write-Host "Swagger: http://localhost:8080/swagger-ui.html" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

& $MVN -f $POM spring-boot:run
