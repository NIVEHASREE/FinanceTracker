pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "finance-frontend"
        BACKEND_IMAGE  = "finance-backend"
        FRONTEND_PORT  = "3000"
        BACKEND_PORT   = "5000"
    }

    stages {

        stage('Build Frontend') {
            steps {
                dir('frontend/finance') {
                    sh "docker build -t $FRONTEND_IMAGE ."
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh "docker build -t $BACKEND_IMAGE ."
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker rm -f frontend backend || true

                docker run -d \
                  --name frontend \
                  -p ${FRONTEND_PORT}:${FRONTEND_PORT} \
                  ${FRONTEND_IMAGE}

                docker run -d \
                  --name backend \
                  -p ${BACKEND_PORT}:${BACKEND_PORT} \
                  ${BACKEND_IMAGE}
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment successful 🚀"
        }

        failure {
            echo "Build or deployment failed ❌"
        }

        always {
            sh "docker image prune -f || true"
        }
    }
}
