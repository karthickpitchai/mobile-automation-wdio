properties([
    parameters([
        [$class: 'ChoiceParameter',
            choiceType: 'PT_SINGLE_SELECT',
            description: 'Mobile Platform',
            filterLength: 1,
            filterable: false,
            name: 'PLATFORM',
            script: [
                $class: 'GroovyScript',
                fallbackScript: [
                    classpath: [],
                    sandbox: true,
                    script: 'return ["Android", "iOS"]'
                ],
                script: [
                    classpath: [],
                    sandbox: true,
                    script: 'return ["Android", "iOS"]'
                ]
            ]
        ],
        [$class: 'CascadeChoiceParameter',
            choiceType: 'PT_SINGLE_SELECT',
            description: 'Select Device',
            name: 'DEVICE_NAME',
            referencedParameters: 'PLATFORM',
            script: [
                $class: 'GroovyScript',
                fallbackScript: [
                    classpath: [],
                    sandbox: false,
                    script: 'return ["SM-S911B"]'
                ],
                script: [
                    classpath: [],
                    sandbox: false,
                    script: '''
                        import groovy.json.JsonSlurper

                        def apiUrl = "http://localhost:5001/api/devices"
                        def deviceList = []

                        try {
                            def url = new URL(apiUrl)
                            def connection = url.openConnection()
                            connection.setRequestMethod("GET")
                            connection.setConnectTimeout(5000)
                            connection.setReadTimeout(5000)
                            connection.connect()

                            def responseCode = connection.getResponseCode()
                            if (responseCode == 200) {
                                def response = connection.getInputStream().getText()
                                def jsonSlurper = new JsonSlurper()
                                def result = jsonSlurper.parseText(response)

                                if (result.success && result.data instanceof List) {
                                    deviceList = result.data.collect { device -> device.name }
                                } else if (result instanceof List) {
                                    deviceList = result.collect { device -> device.name }
                                }

                                deviceList = deviceList.findAll { it != null && it != "" }.unique()
                            }
                        } catch (Exception e) {
                            // Return error info for debugging
                            return ["Error: ${e.class.name}", "Message: ${e.message}", "SM-S911B"]
                        }

                        return deviceList.size() > 0 ? deviceList : ["No devices found", "SM-S911B"]
                    '''
                ]
            ]
        ]
    ])
])

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
                            echo '${response}' | jq -r 'if type == "array" then (.[] | select(.name == "${params.DEVICE_NAME}") | .id) else if type == "object" then (.data[] | select(.name == "${params.DEVICE_NAME}") | .id) else empty end end'
                        """,
                        returnStdout: true
                    ).trim()

                    if (deviceId == null || deviceId.isEmpty()) {
                        error "Device '${params.DEVICE_NAME}' not found or not available"
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
