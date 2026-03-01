#!/bin/bash

echo "=========================================="
echo "Los Santos Builders - Django DRF Backend"
echo "=========================================="

cd django_backend || exit 1

GREEN='\033[0;32m'
NC='\033[0m'

if [ ! -f "db.sqlite3" ]; then
    echo -e "${GREEN}First-time setup detected${NC}"
    python manage.py migrate
    python manage.py seed_mock_data
    echo ""
    echo "Creating superuser (admin)..."
    python manage.py createsuperuser --no-input --username admin --email admin@los-santos.local || true
fi

echo ""
echo -e "${GREEN}Starting Django DRF API Server on port 8000...${NC}"
echo ""
python manage.py runserver 8000
