
pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'yousefebrahim10'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Project') {
            steps {
                sh 'test -f docker-compose.yml'
                sh 'test -f backend/Dockerfile'
                sh 'test -f frontend/Dockerfile'
                echo 'Project validation passed!'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t ecommerce-backend:ci ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t ecommerce-frontend:ci ./frontend'
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
                        echo "$DH_TOKEN" | docker login \
                            -u "$DH_USER" --password-stdin

                        docker tag ecommerce-backend:ci \
                            "$DH_USER/ecommerce-backend:${BUILD_NUMBER}"
                        docker tag ecommerce-backend:ci \
                            "$DH_USER/ecommerce-backend:latest"

                        docker tag ecommerce-frontend:ci \
                            "$DH_USER/ecommerce-frontend:${BUILD_NUMBER}"
                        docker tag ecommerce-frontend:ci \
                            "$DH_USER/ecommerce-frontend:latest"

                        docker push "$DH_USER/ecommerce-backend:${BUILD_NUMBER}"
                        docker push "$DH_USER/ecommerce-backend:latest"
                        docker push "$DH_USER/ecommerce-frontend:${BUILD_NUMBER}"
                        docker push "$DH_USER/ecommerce-frontend:latest"

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD image publishing completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}

