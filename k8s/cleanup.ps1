Write-Host "Cleaning up..." -ForegroundColor Red

kubectl delete -f manifests/ingress.yml
kubectl delete -f manifests/frontend-service.yml
kubectl delete -f manifests/backend-service.yml  
kubectl delete -f manifests/postgresql-service.yml
kubectl delete -f manifests/frontend-deployment.yml
kubectl delete -f manifests/backend-deployment.yml
kubectl delete -f manifests/redis-deployment.yml
kubectl delete -f manifests/postgresql-statefulset.yml
kubectl delete -f secrets/
kubectl delete -f configmaps/
kubectl delete -f manifests/namespace.yml

Write-Host "All clean!" -ForegroundColor Green
