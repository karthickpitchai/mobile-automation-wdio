pipeline {
    agent any

    environment {
        DEVICE_FARM_URL = 'http://192.168.1.67:5001'
    }

    stages {
        stage('Setup') {
            steps {
                sh 'npm install'
            }
        }

        stage('Reserve Device') {
            steps {
                script {
                    def deviceId = sh(
                        script: "curl -s ${DEVICE_FARM_URL}/api/devices | jq -r '.[0].id'",
                        returnStdout: true
                    ).trim()

                    sh """
                        curl -X POST ${DEVICE_FARM_URL}/api/devices/${deviceId}/appium/auto-start \\
                        -H "Content-Type: application/json" \\
                        -d '{"userId": "jenkins", "duration": 90, "purpose": "Pipeline Testing"}'
                    """

                    env.DEVICE_ID = deviceId
                }
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test:android'
            }
        }
    }

    post {
        always {
            script {
                if (env.DEVICE_ID) {
                    sh "curl -X POST ${DEVICE_FARM_URL}/api/devices/${env.DEVICE_ID}/appium/stop"
                }
            }
        }
    }
}