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
            [$class: 'DynamicReferenceParameter',
                choiceType: 'ET_FORMATTED_HTML',
                description: 'Select Device',
                name: 'DEVICE_NAME',
                omitValueField: true,
                script: [
                    $class: 'GroovyScript',
                    fallbackScript: [
                        classpath: [],
                        sandbox: true,
                        script: 'return "<select name=\'value\'><option value=\'SM-S911B\'>SM-S911B</option></select>"'
                    ],
                    script: [
                        classpath: [],
                        sandbox: true,
                        script: '''
                            import groovy.json.JsonSlurper
                            def apiUrl = "http://localhost:5001/api/devices"
                            try {
                                def response = new URL(apiUrl).text
                                def jsonSlurper = new JsonSlurper()
                                def devices = jsonSlurper.parseText(response)

                                def deviceList = []
                                if (devices instanceof List) {
                                    deviceList = devices.collect { it.name }
                                } else if (devices.data instanceof List) {
                                    deviceList = devices.data.collect { it.name }
                                }

                                def options = deviceList.collect { "<option value=\'${it}\'>${it}</option>" }.join("")
                                return "<select name=\'value\'>${options}</select>"
                            } catch (Exception e) {
                                return "<select name=\'value\'><option value=\'SM-S911B\'>SM-S911B (default)</option></select>"
                            }
                        '''
                    ]
                ]
            ]
        ])
    ])

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
