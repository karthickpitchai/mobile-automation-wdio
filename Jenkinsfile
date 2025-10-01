pipeline {
    agent any

    tools {
        nodejs 'NodeJS' // Make sure this matches the name in Jenkins Global Tool Configuration
    }

    environment {
        DEVICE_FARM_URL = 'http://localhost:5001'
        NODE_OPTIONS = '--experimental-vm-modules --no-warnings'  // Enable ES modules and suppress warnings
        NODE_ENV = 'development'
        NPM_CONFIG_LEGACY_PEER_DEPS = 'true'
    }

    stages {

        stage('Setup') {
            steps {
                script {
                    // Set Node.js version and install dependencies
                    sh '''
                        node -v
                        npm -v
                        npm install
                        npm ls read-pkg || true
                    '''
                }
            }
        }

        stage('Reserve Device') {
            steps {
                script {
                    // First, get the response and check its format
                    def response = sh(
                        script: "curl -s ${DEVICE_FARM_URL}/api/devices",
                        returnStdout: true
                    ).trim()
                    
                    // Log the response for debugging
                    // echo "API Response: ${response}"
                    
                    // Parse the response and get first available device
                    def deviceId = sh(
                        script: """
                            echo '${response}' | jq -r 'if type == "array" then .[0].id else if type == "object" then .data[0].id else empty end end'
                        """,
                        returnStdout: true
                    ).trim()
                    
                    if (deviceId == null || deviceId.isEmpty()) {
                        error "No available devices found"
                    }
                    
                    echo "Selected Device ID: ${deviceId}"
                    
                    def startResponse = sh(
                        script: """
                            curl -s -X POST ${DEVICE_FARM_URL}/api/devices/${deviceId}/appium/auto-start \
                            -H "Content-Type: application/json" \
                            -d '{"userId": "jenkins", "duration": 90, "purpose": "Pipeline Testing"}'
                        """,
                        returnStdout: true
                    ).trim()
                    
                    echo "Start Response: ${startResponse}"

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