pipeline {
    agent any

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

                echo 'Project structure validation passed!'
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
    }

    post {
        success {
            echo 'CI Pipeline completed successfully!'
        }

        failure {
            echo 'CI Pipeline failed. Check the logs.'
        }
    }
}
