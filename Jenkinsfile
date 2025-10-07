properties([
    parameters([
        [$class: 'ChoiceParameter',
            choiceType: 'PT_SINGLE_SELECT',
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
            name: 'DEVICE_NAME',
            referencedParameters: 'PLATFORM',
            script: [
                $class: 'GroovyScript',
                fallbackScript: [
                    classpath: [],
                    sandbox: false,
                    script: 'return ["Honor_23"]'
                ],
                script: [
                    classpath: [],
                    sandbox: false,
                    script: '''
                        import groovy.json.JsonSlurper

                        // Get the selected platform from the parameter
                        def selectedPlatform = PLATFORM

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

                                def devices = []
                                if (result.success && result.data instanceof List) {
                                    devices = result.data
                                } else if (result instanceof List) {
                                    devices = result
                                }

                                // Filter devices by platform and online status
                                deviceList = devices.findAll { device ->
                                    device.platform?.toLowerCase() == selectedPlatform?.toLowerCase() &&
                                    device.status?.toLowerCase() == "online"
                                }.collect { device ->
                                    device.name
                                }.findAll { it != null && it != "" }.unique()
                            }
                        } catch (Exception e) {
                            // Return error info for debugging
                            return ["NO_DEVICES_AVAILABLE"]
                        }

                        return deviceList.size() > 0 ? deviceList : ["NO_DEVICES_AVAILABLE"]
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

        stage('Validate Device Selection') {
            steps {
                script {
                    if (params.DEVICE_NAME == 'NO_DEVICES_AVAILABLE') {
                        error("❌ Build aborted: No ${params.PLATFORM} devices are currently online and available. Please check your device farm and try again later.")
                    }
                    echo "✓ Device validation passed: ${params.DEVICE_NAME} (${params.PLATFORM})"
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

                    // Parse hostname and port from start response
                    def appiumHost = sh(
                        script: """
                            echo '${startResponse}' | jq -r '.instructions.webdriverio.config.hostname // "localhost"'
                        """,
                        returnStdout: true
                    ).trim()

                    def appiumPort = sh(
                        script: """
                            echo '${startResponse}' | jq -r '.port // 4723'
                        """,
                        returnStdout: true
                    ).trim()

                    env.DEVICE_ID = deviceId
                    env.APPIUM_HOST = appiumHost
                    env.APPIUM_PORT = appiumPort

                    echo "Appium Server: ${appiumHost}:${appiumPort}"
                }
            }
        }

        stage('Run Tests') {
            steps {
                sh "npm run test:${params.PLATFORM} -- --hostname=${env.APPIUM_HOST} --port=${env.APPIUM_PORT}"
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
