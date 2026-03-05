# Диагностика сервера: майнер + деплой

Выполнить по SSH. Результаты — в терминал, затем «проверяй».

---

## 0. Срочно: кто жрёт CPU (если 100% вернулось)

**Одной командой (если SSH тормозит — выполнить по частям):**
```bash
ps aux --sort=-%cpu | head -10
```

**Полная диагностика:**
```bash
echo "=== TOP CPU (5 процессов) ==="
ps aux --sort=-%cpu | head -6
echo ""
echo "=== ПРОЦЕССЫ В /tmp ==="
ls -la /tmp/
echo ""
echo "=== СКРЫТЫЕ В /tmp ==="
ls -la /tmp/.* 2>/dev/null || echo "none"
echo ""
echo "=== /tmp/.16 существует? ==="
ls -la /tmp/.16 2>/dev/null || echo "not found"
echo ""
echo "=== ld.so.preload (rootkit) ==="
cat /etc/ld.so.preload 2>/dev/null || echo "empty/not found"
```

**Интерпретация:**
| Процесс / путь | Действие |
|----------------|----------|
| `/tmp/.16`, `/tmp/file*`, `/var/tmp/snap`, `/var/tmp/snapd`, `/var/tmp/apt.log`, `/root/.X0-lock`, `/root/.bash_logout` (вредоносный) | **Майнер/дроппер.** Сразу: `pkill -9 -f "/tmp/.16"` → раздел 3 (очистка) |
| `node`, `next`, `/var/www/portfolio` | **Приложение.** Возможен crash loop PM2 или высокая нагрузка. Проверить: `pm2 status`, `pm2 logs` |
| `kworker`, `ksoftirqd` | Ядро Linux, обычно при I/O или сетевой нагрузке |
| Неизвестный бинарник в `/tmp`, `/var/tmp`, `/dev/shm` | Подозрительно — проверить `file /путь` и `strings /путь \| head` |

**Если это Node/Next.js (приложение):**
```bash
pm2 status
pm2 logs portfolio --lines 30 --nostream
```
- Много рестартов (restart > 100) → crash loop. Проверить логи на `TypeError`, `middleware`, `proxy`. Убедиться, что `proxy.ts` в репо и в деплое.
- Нормальные рестарты, но CPU 100% → возможна утечка или тяжёлый рендер. Временно: `pm2 stop portfolio` — если CPU падает, проблема в приложении.

---

## 1. Поиск persistence майнера

**Важно:** майнер подменяет `crontab` в .bashrc — используй `cat /var/spool/cron/crontabs/root`, не `crontab -l`.

```bash
echo "=== CRONTAB (реальный!) ==="
cat /var/spool/cron/crontabs/root 2>/dev/null
echo ""
echo "=== /etc/cron.d/ ==="
ls -la /etc/cron.d/
echo ""
echo "=== /etc/cron.hourly/ ==="
ls -la /etc/cron.hourly/
echo ""
echo "=== /etc/cron.daily/ ==="
ls -la /etc/cron.daily/
echo ""
echo "=== SYSTEMD TIMERS (user) ==="
systemctl list-timers --all 2>/dev/null | head -25
echo ""
echo "=== /etc/ld.so.preload ==="
cat /etc/ld.so.preload 2>/dev/null
echo ""
echo "=== ROOT SHELL FILES ==="
grep -l "tmp\|apt.log\|bash_logout\|\.16" /root/.bashrc /root/.profile /root/.bash_logout 2>/dev/null || echo "no matches"
echo ""
echo "=== /var/tmp and /tmp suspicious (snap, snapd, .16) ==="
ls -la /var/tmp/
ls -la /var/tmp/snap /var/tmp/snapd 2>/dev/null || echo "snap/snapd not found"
ls -la /root/.X0-lock 2>/dev/null || echo ".X0-lock not found"
ls -la /tmp/ | grep -v "^\." | head -20
echo ""
echo "=== PARENT OF .16 (if running) ==="
ps -eo pid,ppid,cmd | grep -E "\.16|2577547" | head -5
```

---

## 2. Pre-built деплой (без кэша — надёжнее scp)

scp падает на больших .pack в `.next/cache`. Кэш не нужен для `next start`.

**Локально (PowerShell):**
```powershell
cd "e:\Работа\Портфолио\b_taYsWcfVdjZ-1772306686522"
Remove-Item -Recurse -Force .next\cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next\dev -ErrorAction SilentlyContinue
tar -czf next.tar.gz -C .next .
scp next.tar.gz root@82.146.40.70:/var/www/portfolio/
```

**На сервере (SSH):**
```bash
cd /var/www/portfolio
pm2 stop portfolio
rm -rf .next
mkdir .next
tar -xzf next.tar.gz -C .next
rm next.tar.gz
pm2 start portfolio
pm2 save
pm2 logs portfolio --lines 5 --nostream
```

---

## 3. Проверка деплоя (ручной)

```bash
echo "=== GIT STATE ==="
cd /var/www/portfolio && git rev-parse HEAD && git status -s
echo ""
echo "=== PUBLIC IP ==="
curl -4 -fsS https://api.ipify.org
echo ""
echo ""
echo "=== deploy-sha.txt in public ==="
cat /var/www/portfolio/public/deploy-sha.txt 2>/dev/null || echo "not found"
echo ""
echo "=== Last deploy (git log) ==="
cd /var/www/portfolio && git log -3 --oneline
```

---

## 3. Полная очистка майнера (включая .bashrc)

**Важно:** майнер модифицирует `/root/.bashrc` — добавляет `top()` и `crontab()` для сокрытия. Нужно очистить и .bashrc.

```bash
# Убить процессы
pkill -9 -f "/tmp/.16"
pkill -9 -f "for p in /proc"
rm -f /tmp/.16 /tmp/file* /var/tmp/snap /var/tmp/snapd /var/tmp/apt.log /root/.X0-lock
rm -f /root/.bash_logout

# Очистить ld.so.preload
echo "" | tee /etc/ld.so.preload

# Очистить crontab
systemctl stop cron
chattr -i /var/spool/cron/crontabs/root 2>/dev/null
printf '' > /var/spool/cron/crontabs/root
chattr +i /var/spool/cron/crontabs/root
systemctl start cron

# Восстановить .bashrc (удалить top/crontab override и прочий вредоносный код)
cp /etc/skel/.bashrc /root/.bashrc
# Если нужны свои настройки — отредактировать после

cp /etc/skel/.bash_logout /root/.bash_logout 2>/dev/null

# Защита от перезаписи (опционально): chattr +i /var/spool/cron/crontabs/root
# Снять: chattr -i /var/spool/cron/crontabs/root

# Проверить /etc/cron.d и cron.hourly
rm -f /etc/cron.d/0 /etc/cron.hourly/0 2>/dev/null
```

**Внимание:** `chattr +i` на crontab блокирует запись — вы не сможете добавлять новые cron-задачи. Чтобы снять: `chattr -i /var/spool/cron/crontabs/root`.

---

## 4. Глубокая диагностика persistence (если майнер возвращается)

Выполнить **до** очистки (пока майнер работает) — чтобы увидеть родителя:

```bash
echo "=== РОДИТЕЛЬ МАЙНЕРА (ppid) ==="
MINER_PID=$(pgrep -f "/tmp/.16" | head -1)
[ -n "$MINER_PID" ] && ps -o pid,ppid,user,cmd -p $MINER_PID && echo "Parent of $MINER_PID:" && ps -o pid,ppid,user,cmd -p $(ps -o ppid= -p $MINER_PID 2>/dev/null | tr -d ' ') 2>/dev/null

echo ""
echo "=== /root/.bashrc (первые 50 строк) ==="
head -50 /root/.bashrc

echo ""
echo "=== /root/.profile ==="
cat /root/.profile 2>/dev/null

echo ""
echo "=== /root/.bash_logout ==="
cat /root/.bash_logout 2>/dev/null

echo ""
echo "=== /etc/profile.d/ (файлы с подозрительным содержимым) ==="
grep -l "tmp\|apt\|snap\|chattr\|var/tmp" /etc/profile.d/* 2>/dev/null || echo "none"
for f in /etc/profile.d/*.sh; do [ -f "$f" ] && grep -E "tmp|apt|snap|chattr|var/tmp|\.16" "$f" 2>/dev/null && echo "--- in $f ---"; done

echo ""
echo "=== /etc/rc.local ==="
cat /etc/rc.local 2>/dev/null

echo ""
echo "=== Содержимое /etc/cron.d/ (все файлы) ==="
for f in /etc/cron.d/*; do [ -f "$f" ] && echo "--- $f ---" && cat "$f"; done

echo ""
echo "=== systemd user timers (root) ==="
sudo -u root XDG_RUNTIME_DIR=/run/user/0 systemctl --user list-timers --all 2>/dev/null | head -30

echo ""
echo "=== Поиск apt.log/snap/.16 в системе ==="
grep -r "apt\.log\|/var/tmp/snap\|/tmp/\.16" /etc/cron* /var/spool/cron /root/.* 2>/dev/null | head -20

echo ""
echo "=== Все crontab пользователей ==="
for u in root $(ls /var/spool/cron/crontabs/ 2>/dev/null); do echo "--- $u ---"; cat /var/spool/cron/crontabs/$u 2>/dev/null; done
```

---

## 5. Если майнер вернулся повторно

- **Пересоздание VPS** — самый надёжный вариант (rootkit мог оставить backdoor). Рекомендуется при первой возможности.
- Пока остаёмся на текущем VPS: после каждой очистки периодически проверять `ps aux --sort=-%cpu | head -5` — при появлении `/tmp/.16` снова выполнить раздел 3.
- Смени пароль root и SSH-ключи, обнови систему (`apt update && apt upgrade`).
- Проверь, как произошло первоначальное заражение (слабый пароль SSH, уязвимость в веб-приложении, необновлённая система).
