#!/bin/bash
# .github/scripts/update-user-properties.sh
# 사용자 활동 기반 자동 userProperties.md 업데이트

USER_PROPS=".github/userProperties.md"
CURRENT_DATE=$(date +"%Y-%m-%d")

# 세션 카운트 증가
CURRENT_SESSION=$(grep "session_count:" $USER_PROPS | awk '{print $2}')
NEW_SESSION=$((CURRENT_SESSION + 1))

# 최근 활동 기록
echo "## 최근 활동 (${CURRENT_DATE})" >> $USER_PROPS
echo "- 세션 #${NEW_SESSION} 시작" >> $USER_PROPS

# Git 커밋 패턴 분석해서 개발 패턴 업데이트
git log --oneline -10 --pretty=format:"%s" | while read commit_msg; do
    if [[ $commit_msg == *"feat:"* ]]; then
        echo "- 새 기능 개발 관심도 증가" >> $USER_PROPS
    elif [[ $commit_msg == *"refactor:"* ]]; then
        echo "- 리팩토링 선호도 확인" >> $USER_PROPS
    fi
done

echo "userProperties.md 업데이트 완료!"
