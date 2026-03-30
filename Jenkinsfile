pipeline {
    agent { label 'windows-fortify' }
    environment {
        FORTIFY_HOME = 'C:\\Program Files\\Fortify\\Fortify SAST Sensor\\OpenText_SAST_Fortify_25.4.0'
        APP_NAME     = 'Next Framework'
        APP_VERSION  = 'main'
        BUILD_ID     = "${APP_NAME}_${BUILD_NUMBER}"
        SSC_URL      = 'http://172.16.14.166:8080/ssc/'
        SSC_TOKEN    = credentials('fortify-ssc-token-str')
        SOURCE_PATH  = "${WORKSPACE}\\source"
    }
    options {
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }
    stages {
        stage('Checkout') {
            steps {
                dir('source') {
                    git branch: 'main',
                        credentialsId: 'git-credentials-id', // ganti dengan ID credentials Git di Jenkins
                        url: 'https://github.com/firmanakbarmln/nextjs-sample.git' // ganti dengan URL repo kamu
                }
            }
        }
        stage('Fortify Clean') {
            steps {
                bat """
                    "%FORTIFY_HOME%\\bin\\sourceanalyzer" ^
                        -b "%BUILD_ID%" ^
                        -clean
                """
            }
        }
        stage('Fortify Translate') {
            steps {
                bat """
                    "%FORTIFY_HOME%\\bin\\sourceanalyzer" ^
                        -b "%BUILD_ID%" ^
                        -exclude "%SOURCE_PATH%\\node_modules\\**" ^
                        -exclude "%SOURCE_PATH%\\.next\\**" ^
                        -exclude "%SOURCE_PATH%\\test\\**" ^
                        "%SOURCE_PATH%"
                """
            }
        }
        stage('Fortify Scan') {
            steps {
                bat """
                    if not exist results mkdir results
                    "%FORTIFY_HOME%\\bin\\sourceanalyzer" ^
                        -b "%BUILD_ID%" ^
                        -scan ^
                        -f "results\\%BUILD_ID%.fpr" ^
                        -Xmx4G
                """
            }
        }
        stage('Upload to SSC') {
            steps {
                bat """
                    "%FORTIFY_HOME%\\bin\\fortifyclient" ^
                        -url %SSC_URL% ^
                        -authtoken %SSC_TOKEN% ^
                        uploadFPR ^
                        -f "results\\%BUILD_ID%.fpr" ^
                        -application "%APP_NAME%" ^
                        -applicationVersion "%APP_VERSION%"
                """
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'results/*.fpr', allowEmptyArchive: true
            cleanWs()
        }
        success {
            echo '✅ Fortify Scan completed successfully'
        }
        failure {
            echo '❌ Build FAILED!'
        }
    }
}