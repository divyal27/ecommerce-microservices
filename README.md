# Microservices E‑Commerce Platform – DevOps Project

This project is a production‑style **DevOps lifecycle** for a microservices e‑commerce application running on a local Kubernetes (Minikube) cluster. It demonstrates end‑to‑end skills across containerization, CI/CD, GitOps, and microservices.

---

## 1. Architecture

The system consists of:

- **Frontend Web (Node.js)** – simple UI that shows live health of backend services.
- **Product Service (Node.js)** – exposes product catalog APIs, backed by PostgreSQL.
- **Cart Service (Node.js + Redis)** – handles shopping cart operations, backed by Redis.
- **PostgreSQL** – stores product data.
- **Redis** – stores cart sessions and cached data.

DevOps tooling:

- **Kubernetes (Minikube)** – runs all services locally as Deployments and Services.
- **Docker** – container images for each microservice.
- **Jenkins** – CI pipeline that builds & pushes images to Docker Hub.
- **Docker Hub** – container registry for versioned images.
- **ArgoCD** – GitOps controller that syncs Kubernetes manifests from GitHub to the cluster.
- **GitHub** – source of truth for application code and Kubernetes YAML.

> _See `docs/architecture.png` for a high‑level diagram of the platform._

---

## 2. Tech Stack

- **Languages**: Node.js, JavaScript
- **Containers & Orchestration**: Docker, Kubernetes (Minikube)
- **CI/CD**: Jenkins, Docker Hub
- **GitOps**: ArgoCD
- **Data Stores**: PostgreSQL, Redis
- **Version Control**: Git + GitHub

---

## 3. DevOps Workflow

1. **Code Commit**
   - Developer pushes code and Kubernetes manifests to GitHub.

2. **Continuous Integration (Jenkins)**
   - Jenkins pipeline is triggered on push.
   - Installs dependencies, runs basic checks.
   - Builds Docker images for:
     - `frontend-web`
     - `product-service`
     - `cart-service`
   - Tags and pushes images to Docker Hub (e.g. `v1`, `v2`, ...).

3. **Continuous Delivery / GitOps (ArgoCD)**
   - ArgoCD watches the GitHub repository.
   - On manifest or image tag updates, it syncs the Minikube cluster:
     - Updates Deployments and Services.
     - Rolls out new versions.

4. **Runtime**
   - Frontend Web talks to Product Service and Cart Service via internal service URLs.
   - Cart Service communicates with Redis; Product Service communicates with PostgreSQL.

> _See `docs/jenkins-pipeline.png`, `docs/argocd-app.png`, and `docs/kubectl-status.png` for CI/CD and runtime views._

---

## 4. Local Setup (Simplified)

> Prerequisites: Docker, Minikube, kubectl, Node.js, Jenkins, ArgoCD installed locally.

1. **Start Minikube**
   ```bash
   minikube start
   ```

2. **Apply Kubernetes Manifests**
   ```bash
   kubectl apply -f k8s/
   ```

3. **Configure Jenkins**
   - Create a pipeline job pointing to this GitHub repository.
   - Add Docker Hub credentials.
   - Run the pipeline to build and push images.

4. **Configure ArgoCD**
   - Add a new ArgoCD Application pointing to this GitHub repo and the `k8s/` folder.
   - Enable auto‑sync so the cluster stays in sync with Git.

5. **Optional: Run Frontend Locally for Quick Check**
   ```bash
   cd frontend-web
   npm install
   node server.js
   # Visit http://localhost:3000
   ```

---

## 5. What This Project Demonstrates

- **Infrastructure as Code**: Kubernetes YAML for microservices, database, and cache.
- **Containerization**: Docker images for each service.
- **Continuous Integration**: Jenkins pipeline building and publishing images to Docker Hub.
- **Continuous Delivery with GitOps**: ArgoCD syncing Kubernetes manifests from GitHub to the cluster.
- **Microservices Best Practices**: Separate services for frontend, product, and cart, backed by Redis and PostgreSQL.

---

## 6. Future Enhancements

- Add Prometheus + Grafana for metrics and dashboards.
- Introduce automated tests and quality gates in the Jenkins pipeline.
- Add Ingress with TLS for production‑grade routing.
