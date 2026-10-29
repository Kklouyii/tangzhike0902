---
name: push-to-github
description: 将当前《高级网页设计》课堂实践项目 git commit 并 push 到 GitHub 仓库 Kklouyii/tangzhike0902,使用已配置的 SSH 公钥认证。当用户要求提交代码、push、同步到 GitHub 或上传项目时使用。不用于 Gitee 或其他远端,不用于其他项目。
---

# Push to GitHub

把当前项目(本技能所在工作区根目录,即《高级网页设计》课堂实践网站)提交并推送到 GitHub 仓库 `Kklouyii/tangzhike0902`,认证方式为 SSH 公钥(已配置,账号 Kklouyii)。

## 步骤

1. 用 Shell 工具在项目根目录执行脚本(必须以项目根目录为 cwd,提交说明来自用户本次要求,未给则用 update site):

   ```powershell
   powershell -ExecutionPolicy Bypass -File .trae/skills/push-to-github/scripts/push.ps1 -Message "<本次提交说明>"
   ```

2. 脚本行为:git add -A → 有暂存变更则 commit(无变更输出 NOTHING_TO_COMMIT)→ 自动把 origin 设为 git@github.com:Kklouyii/tangzhike0902.git → push 当前分支并设置上游。

3. 结果判断:
   - PUSH_OK — 成功,报告仓库地址 https://github.com/Kklouyii/tangzhike0902
   - NOTHING_TO_COMMIT — 没有变更,告知用户无需提交
   - PUSH_FAILED 且提示 Repository not found — 仓库不存在,请用户在 github.com 新建名为 tangzhike0902 的空仓库后重跑
   - PUSH_FAILED 且提示 rejected(non-fast-forward)— 远端有新提交,先 git pull --rebase origin main 再重跑,禁止强推

4. 若报 known_hosts 或主机验证错误,设 GIT_SSH_COMMAND 为 ssh -o StrictHostKeyChecking=accept-new 后重试;不要用密码或 HTTPS 凭据方式。
