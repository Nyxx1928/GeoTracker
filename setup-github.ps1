# GeoTracker GitHub Setup Script
# Run this script to prepare your repository for GitHub

Write-Host "=== GeoTracker GitHub Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (Test-Path .git) {
    Write-Host "Git repository found." -ForegroundColor Green
} else {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Check current remote
Write-Host ""
Write-Host "Current remote configuration:" -ForegroundColor Cyan
git remote -v

Write-Host ""
Write-Host "Choose an option:" -ForegroundColor Yellow
Write-Host "1. Remove existing remote and start fresh"
Write-Host "2. Update remote to new GeoTracker repository"
Write-Host "3. Keep existing remote"
Write-Host ""
$choice = Read-Host "Enter your choice (1-3)"

if ($choice -eq "1") {
    Write-Host "Removing existing remote..." -ForegroundColor Yellow
    git remote remove origin
    Write-Host "Remote removed. You can now add a new one." -ForegroundColor Green
} elseif ($choice -eq "2") {
    Write-Host "Updating remote..." -ForegroundColor Yellow
    git remote remove origin
    $username = Read-Host "Enter your GitHub username"
    git remote add origin "https://github.com/$username/GeoTracker.git"
    Write-Host "Remote updated to: https://github.com/$username/GeoTracker.git" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Stage all files: git add ."
Write-Host "2. Commit: git commit -m 'Initial commit: GeoTracker'"
Write-Host "3. Push: git push -u origin main"
Write-Host ""
Write-Host "Make sure you've created the 'GeoTracker' repository on GitHub first!" -ForegroundColor Yellow

