# Диагностика сервера: майнер + деплой

Выполнить по SSH. Результаты — в терминал, затем «проверяй».

---

## 1. Поиск persistence майнера

```bash
echo "=== CRONTAB ==="
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
echo "=== /var/tmp and /tmp suspicious ==="
ls -la /var/tmp/
ls -la /tmp/ | grep -v "^\." | head -20
echo ""
echo "=== PARENT OF .16 (if running) ==="
ps -eo pid,ppid,cmd | grep -E "\.16|2577547" | head -5
```

---

## 2. Проверка деплоя (ручной)

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

## 3. Полная очистка майнера (если persistence найден)

```bash
# Убить процессы
pkill -9 -f "/tmp/.16"
pkill -9 -f "for p in /proc"
rm -f /tmp/.16 /tmp/file*

# Очистить ld.so.preload
echo "" | tee /etc/ld.so.preload

# Очистить crontab
systemctl stop cron
chattr -i /var/spool/cron/crontabs/root 2>/dev/null
printf '' > /var/spool/cron/crontabs/root
chattr +i /var/spool/cron/crontabs/root
systemctl start cron

# Удалить вредоносные файлы
rm -f /var/tmp/apt.log
cp /etc/skel/.bash_logout /root/.bash_logout 2>/dev/null

# Проверить /etc/cron.d и cron.hourly
rm -f /etc/cron.d/0 /etc/cron.hourly/0 2>/dev/null
```

**Внимание:** `chattr +i` на crontab блокирует запись — вы не сможете добавлять новые cron-задачи. Чтобы снять: `chattr -i /var/spool/cron/crontabs/root`.
