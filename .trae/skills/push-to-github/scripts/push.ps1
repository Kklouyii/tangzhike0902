param(
    [string]$Message = "update site",
    [string]$RepoUrl = "git@github.com:Kklouyii/tangzhike0902.git"
)
$ErrorActionPreference = "Stop"
$env:GIT_SSH_COMMAND = "ssh -o StrictHostKeyChecking=accept-new"

git add -A
$staged = git diff --cached --name-only
if ($staged) {
    git commit -m $Message
} else {
    Write-Output "NOTHING_TO_COMMIT"
}

if (-not (git remote)) {
    git remote add origin $RepoUrl
}

$branch = git branch --show-current
git push -u origin $branch
if ($LASTEXITCODE -eq 0) {
    Write-Output "PUSH_OK"
} else {
    Write-Output "PUSH_FAILED"
    exit 1
}
