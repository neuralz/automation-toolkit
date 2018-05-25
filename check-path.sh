if ! command -v docker-compose &> /dev/null; then
  echo "docker-compose not installed - install docker-compose first"; exit 1;
fi
