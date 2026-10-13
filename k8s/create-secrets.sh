
#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="ecommerce"

read -r -p "RDS endpoint (hostname only): " DB_HOST
read -r -p "Database username: " DB_USER
read -r -s -p "Database password: " DB_PASSWORD
echo
read -r -s -p "JWT secret: " JWT_SECRET
echo

if [[ -z "$DB_HOST" || -z "$DB_USER" || -z "$DB_PASSWORD" || -z "$JWT_SECRET" ]]; then
  echo "Error: all values are required."
  exit 1
fi

if [[ "$DB_HOST" == *"://"* || "$DB_HOST" == *"/"* ]]; then
  echo "Error: enter the RDS hostname only, without https:// or a path."
  exit 1
fi

kubectl create secret generic ecommerce-db-secret \
  --namespace="$NAMESPACE" \
  --from-literal=DB_HOST="$DB_HOST" \
  --from-literal=DB_USER="$DB_USER" \
  --from-literal=DB_PASSWORD="$DB_PASSWORD" \
  --dry-run=client -o yaml

kubectl create secret generic ecommerce-app-secret \
  --namespace="$NAMESPACE" \
  --from-literal=JWT_SECRET="$JWT_SECRET" \
  --dry-run=client -o yaml

unset DB_PASSWORD JWT_SECRET
