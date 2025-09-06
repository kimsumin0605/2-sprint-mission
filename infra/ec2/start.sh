#!/bin/bash

# pm2 설치 
npm install -g pm2

# pm2로 앱 시작 
pm2 start infra/ec2/ecosystem.config.js --env production

# pm2 상태 확인
pm2 status

# pm2 로그 보기
pm2 logs panda-market

# pm2 재시작
pm2 restart panda-market --update-env

# pm2 프로세스 저장
pm2 save

# pm2 부팅 시 자동 시작 설정
pm2 startup
