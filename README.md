# 🚀 Scalable Node.js Backend with Kubernetes + Kind (Local Testing)

This project demonstrates how to deploy a **highly scalable Node.js backend** using **Docker**, **Kubernetes**, and **Horizontal Pod Autoscaler (HPA)** — all tested locally using [**Kind (Kubernetes in Docker)**](https://kind.sigs.k8s.io/).

---

## 📁 Project Structure

```
node-backend-k8s/
├── app/
│   ├── app.js           # Express server
│   └── package.json
├── Dockerfile           # Docker config
├── kind-config.yaml     # Kind cluster setup
└── k8s/                 # Kubernetes manifests
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    └── hpa.yaml
```

---

## ⚙️ Prerequisites

Make sure the following tools are installed:

- [Docker](https://www.docker.com/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Kind](https://kind.sigs.k8s.io/)
- [`hey`](https://github.com/rakyll/hey) (for load testing)

---

## 🚀 Setup and Run Locally (Step-by-Step)

### 1️⃣ Create Kind Cluster

```bash
kind create cluster --name node-cluster --config kind-config.yaml
```

### 2️⃣ Build and Load Docker Image

```bash
docker build -t node-backend:latest .
kind load docker-image node-backend:latest --name node-cluster
```

### 3️⃣ Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/kind/deploy.yaml

kubectl wait --namespace ingress-nginx \
  --for=condition=Ready pods \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

### 4️⃣ Install Metrics Server for HPA

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

kubectl patch deployment metrics-server -n kube-system \
  --type='json' \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
```

### 5️⃣ Deploy App to Kubernetes

```bash
kubectl create namespace backend
kubectl apply -f k8s/deployment.yaml -n backend
kubectl apply -f k8s/service.yaml -n backend
kubectl apply -f k8s/ingress.yaml -n backend
kubectl apply -f k8s/hpa.yaml -n backend
```

### 6️⃣ Setup Local Domain (Optional but cleaner)

Edit `/etc/hosts`:

```plaintext
127.0.0.1 api.yourdomain.com
```

Access app:

```
http://api.yourdomain.com:8080
```

Or directly:

```
http://localhost:8080
```

---

## 📊 Test Auto-Scaling

Simulate traffic to trigger HPA scaling:

```bash
hey -z 60s -c 50 http://api.yourdomain.com:8080/
```

Monitor:

```bash
kubectl get hpa -n backend
kubectl top pods -n backend
```

---

## 🧹 Cleanup

```bash
kind delete cluster --name node-cluster
```

---

## ✅ Features

- 🔧 Express-based Node.js backend
- 🐳 Dockerized
- ☸️ Kubernetes deployment (local)
- 🔁 Horizontal Pod Autoscaling
- 🌐 Ingress Controller with local domain
- 📈 Load testing support

---

## 🧠 Notes

- Works 100% offline (no cloud dependencies)
- Easily portable to cloud Kubernetes (GKE, EKS, DOKS)
- Ideal for learning DevOps, scaling, and K8s basics

---

## 📄 License

MIT – Free to use, modify, and deploy.

---

> Created with ❤️ to learn and deploy scalable backend systems.

isuhd
