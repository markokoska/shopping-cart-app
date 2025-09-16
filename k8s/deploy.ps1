Write-Host "Deploying to k8s..." -ForegroundColor Green

kubectl apply -f manifests/namespace.yml
kubectl apply -f configmaps/
kubectl apply -f secrets/

Write-Host "Starting database..." -ForegroundColor Yellow
kubectl apply -f manifests/postgresql-statefulset.yml
kubectl apply -f manifests/postgresql-service.yml
kubectl wait --for=condition=ready pod -l app=postgresql -n shopping-cart --timeout=300s

kubectl apply -f manifests/redis-deployment.yml
kubectl wait --for=condition=ready pod -l app=redis -n shopping-cart --timeout=120s

Write-Host "Starting backend..." -ForegroundColor Yellow
kubectl apply -f manifests/backend-deployment.yml
kubectl apply -f manifests/backend-service.yml
kubectl wait --for=condition=ready pod -l app=backend -n shopping-cart --timeout=300s

Write-Host "Starting frontend..." -ForegroundColor Yellow
kubectl apply -f manifests/frontend-deployment.yml
kubectl apply -f manifests/frontend-service.yml
kubectl wait --for=condition=ready pod -l app=frontend -n shopping-cart --timeout=120s

kubectl apply -f manifests/ingress.yml

Write-Host "Done!" -ForegroundColor Green
kubectl get all -n shopping-cart

Write-Host "Add to hosts file: 127.0.0.1 shopping-cart.local" -ForegroundColor Yellow
Write-Host "Then visit: http://shopping-cart.local" -ForegroundColor Green
