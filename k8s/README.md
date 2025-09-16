# Kubernetes Setup

Kubernetes manifests for the shopping cart app. Took me a while to figure out all the networking stuff.

## What you need

- k8s cluster (I use Docker Desktop)
- kubectl working
- Images pushed to GitHub registry (the CI does this automatically)

## Deploy

Easy way:
```
.\deploy.ps1
```

Hard way (if the script breaks):
```
kubectl apply -f manifests/namespace.yml
kubectl apply -f configmaps/
kubectl apply -f secrets/
kubectl apply -f manifests/postgresql-statefulset.yml
kubectl apply -f manifests/postgresql-service.yml  
kubectl apply -f manifests/redis-deployment.yml
kubectl apply -f manifests/backend-deployment.yml
kubectl apply -f manifests/backend-service.yml
kubectl apply -f manifests/frontend-deployment.yml
kubectl apply -f manifests/frontend-service.yml
kubectl apply -f manifests/ingress.yml
```

## Access the app

Add to your hosts file:
```
127.0.0.1 shopping-cart.local
```

Then go to http://shopping-cart.local

## Debug stuff

See what's running:
```
kubectl get all -n shopping-cart
```

Check logs when things break:
```
kubectl logs -l app=backend -n shopping-cart
kubectl logs -l app=frontend -n shopping-cart  
```

Clean up everything:
```
.\cleanup.ps1
```
