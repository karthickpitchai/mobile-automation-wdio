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
        ],
        [$class: 'ChoiceParameter',
            choiceType: 'PT_SINGLE_SELECT',
            filterLength: 1,
            filterable: false,
            name: 'TEST_TYPE',
            script: [
                $class: 'GroovyScript',
                fallbackScript: [
                    classpath: [],
                    sandbox: true,
                    script: 'return ["Smoke", "Sanity", "Regression"]'
                ],
                script: [
                    classpath: [],
                    sandbox: true,
                    script: 'return ["Smoke", "Sanity", "Regression"]'
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
                    // Create unique filenames for this build
                    def devicesFile = "/tmp/devices_response_${BUILD_NUMBER}.json"
                    def startFile = "/tmp/start_response_${BUILD_NUMBER}.json"

                    // Save devices API response to file
                    sh "curl -s ${DEVICE_FARM_URL}/api/devices > ${devicesFile}"

                    // Parse the response and filter by device name
                    def deviceId = sh(
                        script: """
                            jq -r 'if type == "array" then (.[] | select(.name == "${params.DEVICE_NAME}") | .id) else if type == "object" then (.data[] | select(.name == "${params.DEVICE_NAME}") | .id) else empty end end' ${devicesFile}
                        """,
                        returnStdout: true
                    ).trim()

                    if (deviceId == null || deviceId.isEmpty()) {
                        error "Device '${params.DEVICE_NAME}' not found or not available"
                    }

                    echo "Selected Device ID: ${deviceId}"

                    // Save auto-start response to file for parsing
                    sh """
                        curl -s -X POST ${DEVICE_FARM_URL}/api/devices/${deviceId}/appium/auto-start \
                        -H "Content-Type: application/json" \
                        -d '{"userId": "jenkins", "duration": 90, "purpose": "Pipeline Testing"}' \
                        > ${startFile}
                    """

                    echo "Device started successfully"

                    // Parse configuration from auto-start API response
                    def appiumHost = sh(
                        script: "jq -r '.instructions.webdriverio.config.hostname // \"localhost\"' ${startFile}",
                        returnStdout: true
                    ).trim()

                    def appiumPort = sh(
                        script: "jq -r '.port // 4723' ${startFile}",
                        returnStdout: true
                    ).trim()

                    def deviceName = sh(
                        script: "jq -r '.capabilities.deviceName // \"${params.DEVICE_NAME}\"' ${startFile}",
                        returnStdout: true
                    ).trim()

                    def udid = sh(
                        script: "jq -r '.capabilities.udid // \"${params.DEVICE_NAME}\"' ${startFile}",
                        returnStdout: true
                    ).trim()

                    def platformVersion = sh(
                        script: "jq -r '.capabilities.platformVersion // \"14.0\"' ${startFile}",
                        returnStdout: true
                    ).trim()

                    env.DEVICE_ID = deviceId
                    env.APPIUM_HOST = appiumHost
                    env.APPIUM_PORT = appiumPort
                    env.DEVICE_NAME = deviceName
                    env.UDID = udid
                    env.PLATFORM_VERSION = platformVersion

                    echo "Appium Server: ${appiumHost}:${appiumPort}"
                    echo "Device: ${deviceName} (UDID: ${udid}, Platform Version: ${platformVersion})"
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def args = [
                        "--hostname=${env.APPIUM_HOST}",
                        "--port=${env.APPIUM_PORT}",
                        "--deviceName=${env.DEVICE_NAME}",
                        "--testType=${params.TEST_TYPE}"
                    ]

                    if (env.UDID && env.UDID != "") {
                        args.add("--udid=${env.UDID}")
                    }

                    if (env.PLATFORM_VERSION && env.PLATFORM_VERSION != "") {
                        args.add("--platformVersion=${env.PLATFORM_VERSION}")
                    }

                    def argsString = args.join(' ')
                    echo "Test arguments: ${argsString}"

                    try {
                        sh "npm run test:${params.PLATFORM} -- ${argsString}"
                    } catch (Exception e) {
                        echo "Test execution failed: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Stop the device/appium session
                if (env.DEVICE_ID) {
                    try {
                        echo "Stopping device: ${env.DEVICE_ID}"
                        sh "curl -s -X POST ${DEVICE_FARM_URL}/api/devices/${env.DEVICE_ID}/appium/stop"
                        echo "Device stopped successfully"
                    } catch (Exception e) {
                        echo "Warning: Failed to stop device: ${e.message}"
                    }
                }

                // Cleanup temporary files for this build
                try {
                    sh "rm -f /tmp/devices_response_${BUILD_NUMBER}.json /tmp/start_response_${BUILD_NUMBER}.json"
                } catch (Exception e) {
                    echo "Warning: Failed to cleanup temp files: ${e.message}"
                }
            }
        }
    }
}
