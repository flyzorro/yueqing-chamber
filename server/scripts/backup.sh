#!/bin/bash
# 数据库备份脚本

# 配置
DB_NAME="yueqing_chamber"
DB_USER="postgres"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${DATE}.sql"

# 创建备份目录
mkdir -p ${BACKUP_DIR}

# 执行备份
echo "开始备份数据库 ${DB_NAME}..."
pg_dump -U ${DB_USER} -d ${DB_NAME} -F c -f ${BACKUP_FILE}

if [ $? -eq 0 ]; then
    echo "备份成功：${BACKUP_FILE}"
    # 压缩备份
    gzip ${BACKUP_FILE}
    echo "压缩完成：${BACKUP_FILE}.gz"
    
    # 清理 7 天前的备份
    find ${BACKUP_DIR} -name "backup_*.sql.gz" -mtime +7 -delete
    echo "已清理 7 天前的旧备份"
else
    echo "备份失败!"
    exit 1
fi
