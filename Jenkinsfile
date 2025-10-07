pipeline {
    agent any

    tools {
        nodejs 'NodeJS' // Make sure this matches the name in Jenkins Global Tool Configuration
    }
    
    environment {
        DEVICE_FARM_URL = 'http://localhost:5001'
        NODE_OPTIONS = '--experimental-vm-modules'  // Enable ES modules
        NODE_ENV = 'development'
    }
    parameters {
        choice(name: 'PLATFORM', choices: ['Android' , 'iOS'], description: 'Mobile Platform')
    }

    stages {
        //   stage('Clean') {
        //     steps {
        //         script {
        //             // Clean npm cache and remove node_modules
        //             sh '''
        //                 npm cache clean --force
        //                 rm -rf node_modules package-lock.json
        //             '''
        //         }
        //     }
        // }
        // stage('Setup') {
        //     steps {
        //         script {
        //             // Set Node.js version and install dependencies
        //             sh '''
        //                 node -v
        //                 npm -v
        //                 npm install
        //             '''
        //         }
        //     }
        // }

        stage('Select Device') {
            steps {
                script {
                    // Get available devices from API
                    def response = sh(
                        script: "curl -s ${DEVICE_FARM_URL}/api/devices",
                        returnStdout: true
                    ).trim()

                    // Extract device names
                    def deviceNames = sh(
                        script: """
                            echo '${response}' | jq -r 'if type == "array" then (.[].name) else if type == "object" then (.data[].name) else empty end end' | tr '\\n' ',' | sed 's/,\$//'
                        """,
                        returnStdout: true
                    ).trim()

                    if (deviceNames.isEmpty()) {
                        error "No devices available"
                    }

                    // Convert comma-separated string to list for input choices
                    def deviceList = deviceNames.split(',').collect { it.trim() }

                    // Let user select device
                    env.DEVICE_NAME = input(
                        message: 'Select Device',
                        parameters: [
                            choice(name: 'DEVICE_NAME', choices: deviceList, description: 'Available Devices')
                        ]
                    )

                    echo "Selected Device: ${env.DEVICE_NAME}"
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

                    // Parse the response and filter by device name
                    def deviceId = sh(
                        script: """
                            echo '${response}' | jq -r 'if type == "array" then (.[] | select(.name == "${env.DEVICE_NAME}") | .id) else if type == "object" then (.data[] | select(.name == "${env.DEVICE_NAME}") | .id) else empty end end'
                        """,
                        returnStdout: true
                    ).trim()

                    if (deviceId == null || deviceId.isEmpty()) {
                        error "Device '${env.DEVICE_NAME}' not found or not available"
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
                sh "npm run test:${params.PLATFORM}"
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
