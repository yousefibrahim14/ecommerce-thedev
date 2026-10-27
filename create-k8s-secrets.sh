#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"; unset DB_PASSWORD JWT_SECRET DB_HOST' EXIT

DB_HOST=$(cd terraform/aws-eu-central-1 && terraform output -raw rds_endpoint)
read -rsp "Enter current RDS password: " DB_PASSWORD
echo

if [[ -z "$DB_HOST" || -z "$DB_PASSWORD" ]]; then
  echo "Missing required value."
  exit 1
fi

JWT_SECRET=$(openssl rand -hex 32)

printf 'DB_HOST=%s\nDB_USER=ecommerce_admin\nDB_PASSWORD=%s\n' \
  "$DB_HOST" "$DB_PASSWORD" > "$tmpdir/db.env"
printf 'JWT_SECRET=%s\n' "$JWT_SECRET" > "$tmpdir/app.env"

kubectl create secret generic ecommerce-db-secret \
  -n ecommerce --from-env-file="$tmpdir/db.env" \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic ecommerce-app-secret \
  -n ecommerce --from-env-file="$tmpdir/app.env" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Both Kubernetes Secrets are ready."
