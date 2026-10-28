# E-Commerce DevOps Project

An end-to-end E-Commerce application integrated with modern DevOps practices, including containerization, CI/CD automation, Kubernetes deployment, Infrastructure as Code, and monitoring.

This project demonstrates how to develop, containerize, deploy, and monitor a full-stack web application using industry-relevant DevOps tools and cloud infrastructure.

## Project Overview

The application consists of a React frontend, a Node.js and Express backend, and a PostgreSQL database. Docker is used to containerize the application components, while Jenkins automates the CI/CD workflow.

The deployment environment uses Kubernetes on Amazon EKS, with Terraform for infrastructure provisioning. Prometheus and Grafana are used for monitoring and visualization.

**Project Repository:** [ecommerce-thedev](https://github.com/yousefibrahim14/ecommerce-thedev)

**Project Status:** The application and deployment workflow were tested during the project. The AWS lab infrastructure has since been cleaned up and is not currently running.

---

## 🏗️ System Architecture

The following diagram illustrates the main components of the E-Commerce DevOps project, including the application, CI/CD pipeline, AWS infrastructure, and monitoring stack.

```mermaid
flowchart LR
    subgraph App["Application Layer"]
        User["User / Customer"]
        Frontend["React + Vite Frontend"]
        Backend["Node.js + Express Backend API"]
        User -->|Access| Frontend
        Frontend -->|REST API| Backend
    end

    subgraph CICD["CI/CD Pipeline"]
        Developer["Developer"]
        GitHub["GitHub Repository"]
        Jenkins["Jenkins Pipeline"]
        Docker["Docker Image Build"]
        Registry["Docker Hub Registry"]
        Developer -->|Push code| GitHub
        GitHub -->|Trigger| Jenkins
        Jenkins -->|Build| Docker
        Docker -->|Push images| Registry
    end

    subgraph Infra["AWS Infrastructure"]
        Terraform["Terraform"]
        AWS["AWS Infrastructure"]

        subgraph EKS["Amazon EKS Cluster"]
            Deployment["Kubernetes Deployment"]
            FrontendPod["Frontend Pods"]
            BackendPod["Backend Pods"]
            Deployment -->|Deploy| FrontendPod
            Deployment -->|Deploy| BackendPod
        end

        Database[("Amazon RDS for PostgreSQL")]
        Terraform -->|Provision| AWS
        Terraform -->|Provision| EKS
        AWS -->|Hosts| EKS
        BackendPod -->|PostgreSQL connection| Database
    end

    subgraph Monitor["Monitoring Layer"]
        Prometheus["Prometheus"]
        Grafana["Grafana Dashboards"]
        Prometheus -->|Metrics data| Grafana
    end

    Frontend -.->|Runs as| FrontendPod
    Backend -.->|Runs as| BackendPod
    Registry -->|Pull container images| Deployment
    FrontendPod -.->|Metrics| Prometheus
    BackendPod -.->|Metrics| Prometheus
```

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Frontend | React, Vite | Building the user interface |
| Backend | Node.js, Express.js | Implementing REST APIs and business logic |
| Database | PostgreSQL, Amazon RDS for PostgreSQL | Storing application data |
| Containerization | Docker, Docker Compose | Packaging and running application services |
| Version Control | Git, GitHub | Source code management and collaboration |
| CI/CD | Jenkins | Automating the build and deployment workflow |
| Container Registry | Docker Hub | Storing and distributing Docker images |
| Orchestration | Kubernetes, Amazon EKS | Deploying and managing application containers |
| Infrastructure as Code | Terraform | Provisioning AWS infrastructure |
| Monitoring | Prometheus, Grafana | Collecting metrics and visualizing monitoring data |

---

## ✨ Application Features

### Product and Category Management
- Retrieve and display products from the backend API.
- Organize products by categories.
- Store product and category data in PostgreSQL.

### Authentication and Authorization
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication for protected API endpoints.

### Shopping and Orders
- Add products to the shopping cart.
- Review cart items and proceed to checkout.
- Place orders and view order history.

### Full-Stack Integration
- React frontend integrated with the Node.js and Express backend.
- REST API communication between frontend and backend.
- PostgreSQL database integration for persistent application data.

---

## 🔄 CI/CD Pipeline

The project uses Jenkins to automate backend testing, Docker image building, image publishing, and Kubernetes deployment.

### Pipeline Stages

1. **Checkout:** Retrieves the project source code from the configured SCM repository.
2. **Project Validation:** Checks that required application files, tests, Dockerfiles, and Kubernetes manifests exist.
3. **Backend Testing:** Installs backend dependencies with `npm ci` and runs automated tests using `npm test`.
4. **EKS Access Validation:** Verifies AWS authentication, updates the EKS kubeconfig, and checks Kubernetes nodes and application deployments.
5. **Build Docker Images:** Builds separate Docker images for the backend and frontend.
6. **Push Images to Docker Hub:** Publishes versioned images using the Jenkins build number and also updates the `latest` tags.
7. **Deploy to Amazon EKS:** Updates the backend and frontend Kubernetes Deployments to use the newly published images.
8. **Deployment Verification:** Waits for both Deployments to complete their rollout and displays the resulting Deployment and Pod status.

### CI/CD Workflow

```mermaid
flowchart TD
    A["GitHub Repository"] --> B["Checkout"]
    B --> C["Validate Project Files"]
    C --> D["Run Backend Tests"]
    D --> E["Validate AWS and EKS Access"]
    E --> F["Build Backend Image"]
    F --> G["Build Frontend Image"]
    G --> H["Push Images to Docker Hub"]
    H --> I["Update Kubernetes Deployments"]
    I --> J["Wait for Rollout Completion"]
    J --> K["Check Deployment and Pod Status"]

    classDef source fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    classDef test fill:#fef3c7,stroke:#d97706,stroke-width:2px
    classDef build fill:#ffedd5,stroke:#ea580c,stroke-width:2px
    classDef deploy fill:#dcfce7,stroke:#16a34a,stroke-width:2px

    class A,B source
    class C,D,E test
    class F,G,H build
    class I,J,K deploy
```

### Image Tagging

Docker images are tagged with the Jenkins build number to identify individual pipeline builds. The pipeline also updates the `latest` tag for both application components.

- `ecommerce-backend:<BUILD_NUMBER>`
- `ecommerce-frontend:<BUILD_NUMBER>`
- `ecommerce-backend:latest`
- `ecommerce-frontend:latest`

### Credentials and Deployment Configuration

Jenkins uses configured credentials for Docker Hub authentication and AWS access. Kubernetes deployment commands target the `ecommerce` namespace in the configured Amazon EKS cluster.

Sensitive credentials are stored in Jenkins Credentials rather than hardcoded into the pipeline script.

---

## ☁️ AWS Infrastructure & Terraform

Terraform is used to define the AWS infrastructure required to support the E-Commerce application and its Kubernetes deployment.

### Infrastructure Components

| Component | Purpose |
|---|---|
| Amazon VPC | Provides network isolation for the AWS environment |
| Public and Private Subnets | Organize resources into public and private network segments |
| Internet Gateway | Provides internet connectivity for applicable public resources |
| NAT Gateway and Elastic IP | Support outbound internet access from private subnets |
| Route Tables | Control traffic routing between network destinations |
| Amazon EKS | Provides the managed Kubernetes control plane |
| EKS Managed Node Group | Provides worker nodes for running application workloads |
| Amazon RDS for PostgreSQL | Provides a managed relational database outside the Kubernetes cluster |
| Security Groups | Control permitted network traffic |
| IAM Roles and Policies | Provide permissions for EKS and related AWS components |
| OIDC Provider | Supports IAM integration for Kubernetes service accounts and AWS services |
| AWS Load Balancer Controller IAM Resources | Define the IAM resources associated with load balancer controller integration |

### Infrastructure as Code Workflow

```mermaid
flowchart TD
    A["Terraform Configuration"] --> B["Initialize Providers"]
    B --> C["Review Terraform Plan"]
    C --> D["Provision AWS Resources"]
    D --> E["Configure EKS and Networking"]
    E --> F["Deploy Application Workloads"]
    F --> G["Connect Backend to Amazon RDS"]

    classDef config fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    classDef infra fill:#dcfce7,stroke:#16a34a,stroke-width:2px
    classDef app fill:#ffedd5,stroke:#ea580c,stroke-width:2px

    class A,B,C config
    class D,E infra
    class F,G app
```

### Terraform Configuration

The Terraform configuration is organized into multiple files:

- `main.tf` — VPC, networking, security groups, and RDS resources.
- `eks.tf` — EKS cluster, managed node group, IAM roles, and policy attachments.
- `alb-controller.tf` — IAM and OIDC resources associated with AWS Load Balancer Controller integration.
- `variables.tf` — Input variables.
- `outputs.tf` — Terraform outputs.
- `versions.tf` — Terraform and provider configuration.

### Infrastructure Status

The AWS lab infrastructure was provisioned and used during project implementation. The lab resources have since been cleaned up and are not currently running.

The Terraform configuration is retained in the repository for infrastructure review and future lab deployments. Review the Terraform plan and estimated AWS costs before provisioning resources again.

---

## ☸️ Kubernetes Deployment

Kubernetes is used to deploy and manage the frontend and backend application components in Amazon EKS.

### Deployment Components

- **Amazon EKS:** Managed Kubernetes environment used for the application deployment.
- **Namespace:** Application resources are deployed in the `ecommerce` namespace.
- **Backend Deployment:** Runs the Node.js and Express REST API.
- **Frontend Deployment:** Runs the React and Vite frontend.
- **Container Images:** Backend and frontend images are published to Docker Hub and referenced by the Kubernetes Deployments.
- **Amazon RDS:** The backend connects to Amazon RDS for PostgreSQL, which runs separately from the Kubernetes cluster.

### Deployment Workflow

The Jenkins pipeline updates the container images used by the Kubernetes Deployments and waits for both rollouts to complete.

```bash
kubectl get deployments,pods -n ecommerce
```

To inspect the rollout status of the backend:

```bash
kubectl rollout status deployment/ecommerce-backend -n ecommerce
```

To inspect the rollout status of the frontend:

```bash
kubectl rollout status deployment/ecommerce-frontend -n ecommerce
```

### Kubernetes Manifests

The repository contains Kubernetes deployment manifests under the `k8s/` directory, including:

- `k8s/backend-deployment.yaml`
- `k8s/frontend-deployment.yaml`

These manifests define the application workloads used by the deployment workflow.

### Deployment Status

The application was deployed and tested on Amazon EKS during the project. The AWS lab infrastructure has since been cleaned up, so the cluster and its workloads are not currently running.

---

## 📊 Monitoring with Prometheus & Grafana

Prometheus and Grafana were used to monitor the Kubernetes environment and visualize metrics during the project.

### Prometheus
- Collects metrics from configured monitoring targets.
- Provides a query interface for inspecting collected metrics.
- Helps monitor Kubernetes workloads and resource states.

### Grafana
- Provides dashboards for visualizing monitoring data.
- Uses Prometheus as a data source to display metrics.
- Helps make workload and infrastructure metrics easier to interpret.

### Monitoring Workflow

```mermaid
flowchart LR
    A["Kubernetes Workloads"] --> B["Prometheus"]
    B --> C["Grafana Dashboards"]

    classDef workload fill:#dcfce7,stroke:#16a34a,stroke-width:2px
    classDef metrics fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    classDef dashboard fill:#f3e8ff,stroke:#9333ea,stroke-width:2px

    class A workload
    class B metrics
    class C dashboard
```

### Monitoring Status

Prometheus targets and metric queries were verified during the project. The AWS lab infrastructure has since been cleaned up, so the monitoring environment is not currently running.

---

## 📸 Screenshots

The following screenshots will showcase the application, CI/CD pipeline, Kubernetes deployment, and monitoring environment.

| Component | Screenshot |
|---|---|
| Products Page | `docs/screenshots/products-page.png` |
| Authentication | `docs/screenshots/authentication.png` |
| Order Workflow | `docs/screenshots/order-workflow.png` |
| Jenkins Pipeline | `docs/screenshots/jenkins-pipeline.png` |
| Kubernetes Workloads | `docs/screenshots/kubernetes-workloads.png` |
| Prometheus Targets | `docs/screenshots/prometheus-targets.png` |
| Grafana Dashboard | `docs/screenshots/grafana-dashboard.png` |
| AWS Architecture | `docs/screenshots/aws-eks-architecture.png` |

Add the actual project screenshots to the `docs/screenshots/` directory before using the image references below.

### Application

![E-Commerce Authentication](docs/screenshots/authentication.png)

![E-Commerce Products Page](docs/screenshots/products-page.png)

![E-Commerce Order History](docs/screenshots/order-workflow.png)

### CI/CD and Kubernetes

![Jenkins CI/CD Pipeline Successful Build](docs/screenshots/jenkins-pipeline.png)

![Kubernetes Workloads](docs/screenshots/kubernetes-workloads.png)

### Monitoring

![Prometheus Targets](docs/screenshots/prometheus-targets.png)

![Grafana Kubernetes Monitoring Dashboard](docs/screenshots/grafana-dashboard.png)


