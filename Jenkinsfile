pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'yousefebrahim10'
        AWS_DEFAULT_REGION = 'eu-central-1'
        AWS_REGION = 'eu-central-1'
        KUBECONFIG = "${WORKSPACE}/.kube/config"
        EKS_CLUSTER_NAME = 'ecommerce-lab-eks'
        K8S_NAMESPACE = 'ecommerce'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Project') {
            steps {
                sh '''
                    set -eu

                    test -f docker-compose.yml
                    test -f backend/Dockerfile
                    test -f frontend/Dockerfile
                    test -f Jenkinsfile
                    test -f k8s/backend-deployment.yaml
                    test -f k8s/frontend-deployment.yaml

                    echo "Project validation passed!"
                '''
            }
        }

        stage('Test EKS Access') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecommerce-admin',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        set +x
                        set -eu
                        export AWS_PAGER=""

                        echo "Testing AWS authentication..."
                        aws sts get-caller-identity

                        echo "Preparing kubeconfig directory..."
                        mkdir -p "$(dirname "$KUBECONFIG")"

                        echo "Updating EKS kubeconfig..."
                        aws eks update-kubeconfig \
                            --region "$AWS_DEFAULT_REGION" \
                            --name "$EKS_CLUSTER_NAME" \
                            --kubeconfig "$KUBECONFIG"

                        echo "Testing Kubernetes access..."
                        kubectl get nodes
                        kubectl get deployments -n "$K8S_NAMESPACE"

                        echo "EKS access test passed!"
                    '''
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    set -eu

                    docker build \
                        -t ecommerce-backend:ci \
                        ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    set -eu

                    docker build \
                        -t ecommerce-frontend:ci \
                        ./frontend
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DH_USER',
                        passwordVariable: 'DH_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        set -eu

                        echo "$DH_TOKEN" | docker login \
                            --username "$DH_USER" \
                            --password-stdin

                        trap 'docker logout >/dev/null 2>&1 || true' EXIT

                        docker tag ecommerce-backend:ci \
                            "$DH_USER/ecommerce-backend:${BUILD_NUMBER}"

                        docker tag ecommerce-backend:ci \
                            "$DH_USER/ecommerce-backend:latest"

                        docker tag ecommerce-frontend:ci \
                            "$DH_USER/ecommerce-frontend:${BUILD_NUMBER}"

                        docker tag ecommerce-frontend:ci \
                            "$DH_USER/ecommerce-frontend:latest"

                        docker push \
                            "$DH_USER/ecommerce-backend:${BUILD_NUMBER}"

                        docker push \
                            "$DH_USER/ecommerce-backend:latest"

                        docker push \
                            "$DH_USER/ecommerce-frontend:${BUILD_NUMBER}"

                        docker push \
                            "$DH_USER/ecommerce-frontend:latest"

                        echo "Docker images pushed successfully!"
                    '''
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecommerce-admin',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        set +x
                        set -eu
                        export AWS_PAGER=""

                        echo "Preparing kubeconfig directory..."
                        mkdir -p "$(dirname "$KUBECONFIG")"

                        echo "Refreshing EKS kubeconfig..."
                        aws eks update-kubeconfig \
                            --region "$AWS_DEFAULT_REGION" \
                            --name "$EKS_CLUSTER_NAME" \
                            --kubeconfig "$KUBECONFIG"

                        echo "Deploying backend image..."
                        kubectl set image \
                            deployment/ecommerce-backend \
                            backend="$DOCKERHUB_USER/ecommerce-backend:${BUILD_NUMBER}" \
                            -n "$K8S_NAMESPACE"

                        echo "Deploying frontend image..."
                        kubectl set image \
                            deployment/ecommerce-frontend \
                            frontend="$DOCKERHUB_USER/ecommerce-frontend:${BUILD_NUMBER}" \
                            -n "$K8S_NAMESPACE"

                        echo "Waiting for backend rollout..."
                        kubectl rollout status \
                            deployment/ecommerce-backend \
                            -n "$K8S_NAMESPACE" \
                            --timeout=180s

                        echo "Waiting for frontend rollout..."
                        kubectl rollout status \
                            deployment/ecommerce-frontend \
                            -n "$K8S_NAMESPACE" \
                            --timeout=180s

                        echo "Final deployment status..."
                        kubectl get deployments,pods \
                            -n "$K8S_NAMESPACE"

                        echo "EKS deployment completed successfully!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}

