@NonCPS
static sortByField(list, delimiter, reversed) {
    list.sort{ (reversed ? -1 : 1 ) * (it.split(delimiter)[1] as int) }
}

pipeline {
    options {
        disableConcurrentBuilds()
    }
    environment {
        DOCKER_IMAGE_NAME = 'mcc'
        HOST_PROJECT_DIR = ''
        PORT = '8080'
        EXPOSE_PORT = ''
        REMOVE_MODULES = '${removeModules}'
        ENV_PREFIX = 'MCC_'

        CREDENTIALS_ID ='github_rsa'
        GIT_URL = ''


        // PROJECT VARIABLES
        MCC_PORT = "${PORT}"
        MCC_PROJECT_NAME=''
        MCC_LOGS_NAME = "${MCC_PROJECT_NAME}-${BUILD_ID}"
        MCC_BASE_URL=''
        MCC_HASH_SALT=''
        MCC_DB_HOST=''
        MCC_DB_PORT=''
        MCC_DB_USER=''
        MCC_DB_PASSWORD=''
        MCC_DB_NAME=''
        MCC_CONFIRMATION_PREFIX=''
        MCC_RECOVER_LINK_PREFIX=''
        MCC_SESSION_PREFIX=''
        MCC_SESSION_KEY=''
        MCC_SESSION_EXPIRE='90'
        MCC_JWT_SECRET=''
        MCC_JWT_ACCESS_EXPIRATION='60'
        MCC_AES_IV=''
        MCC_AES_SECRET=''
        MCC_REDIS_HOST=''
        MCC_REDIS_PORT=''
        MCC_REDIS_PASS=''
        MCC_MAIL_USER=''
        MCC_MAIL_PASSWORD=''
        MCC_MAIL_HOST=''
        MCC_MAIL_PORT=''
        MCC_MAIL_NAME='MCC'
    }

    agent any

    stages {
        stage("Git jobs") {
            steps {
                git credentialsId: "${CREDENTIALS_ID}", url: "${GIT_URL}"
                // sh "${removeModules} && rm -R node_modules && echo 'Modules removed' || echo 'No need to remove modules'"
            }
        }


        stage ("Stop container") {
            steps {
                script {
                    def KEEP_N_LAST_INSTANCES = 5
                    def CONTAINERS = sh (
                        script: 'docker ps -a -q --filter name="^${DOCKER_IMAGE_NAME}-[0-9]*\$" --format="{{.Names}}"',
                        returnStdout: true
                    ).trim().tokenize('\n')

                    sortByField(CONTAINERS, '-', true)
                    // CONTAINERS.sort { -(it.split('-')[1] as int) }
                    println CONTAINERS

                    // Stop all containers
                    if (CONTAINERS.size()) {
                        def CONTAINERS_STR = String.join(' ', CONTAINERS)
                        sh "docker stop ${CONTAINERS_STR}"
                        echo 'Containers stopped'
                    } else {
                        echo 'Not found running containers'
                    }

                    // Delete old containers
                    def CONTAINERS_TO_DELETE = CONTAINERS.size() > KEEP_N_LAST_INSTANCES ? CONTAINERS[KEEP_N_LAST_INSTANCES..-1] : []

                    if (CONTAINERS_TO_DELETE.size()) {
                        def CONTAINERS_DELETE_STR = String.join(' ', CONTAINERS_TO_DELETE)
                        sh "docker rm ${CONTAINERS_DELETE_STR}"
                        echo 'Containers deleted'
                    } else {
                        echo "Have less than ${KEEP_N_LAST_INSTANCES} containers. Nothing deleted"
                    }

                    // Delete old images
                    def IMAGES = sh (
                        script: 'docker images --filter reference="${DOCKER_IMAGE_NAME}:[0-9]*" --format="{{.Repository}}:{{.Tag}}"',
                        returnStdout: true
                    ).trim().tokenize('\n')

                    sortByField(IMAGES, ':', true)
                    // IMAGES.sort { -(it.split(':')[1] as int) }
                    println IMAGES

                    def IMAGES_TO_DELETE = IMAGES.size() > KEEP_N_LAST_INSTANCES ? IMAGES[KEEP_N_LAST_INSTANCES..-1] : []

                    if (IMAGES_TO_DELETE.size()) {
                        def IMAGES_TO_DELETE_STR = String.join(' ', IMAGES_TO_DELETE)
                        sh "docker image rm -f ${IMAGES_TO_DELETE_STR}"
                        echo 'Images deleted'
                    } else {
                        echo "Have less than ${KEEP_N_LAST_INSTANCES} images. Nothing deleted"
                    }


                    //sh  "[ '${CONTAINERS}' ] && docker stop ${CONTAINERS} && && echo 'Containers stopped' || echo 'Not found running containers'"
                    //sh  "[ '${CONTAINERS_TO_DELETE}' ] && docker rm ${CONTAINERS_TO_DELETE} && && echo 'Containers deleted' || echo 'Have less than ${KEEP_N_LAST_CONTAINERS} containers'"
                }
                // sh 'docker stop "${DOCKER_IMAGE_NAME}-${latestBuildNumber}" && echo "container ${latestBuildNumber} removed" || echo "container ${latestBuildNumber} does not exist"'
            }
        }

        stage("Build image") {
            steps {
                // Build image if not exists
                sh ('docker build --build-arg PORT=${PORT} -f Dockerfile . -t ${DOCKER_IMAGE_NAME}:${BUILD_ID}')
            }
        }

        stage("Build project") {
            steps {
                script {
                    def ENVS = sh (
                            script: "env | grep ${ENV_PREFIX}",
                            returnStdout: true
                        ).trim()

                    def envFile = writeFile file: 'env.list', text: ENVS

                    // print env

                    sh 'docker run -d -t --restart unless-stopped --name ${DOCKER_IMAGE_NAME}-${BUILD_ID} -w /usr/src/app -v ${HOST_PROJECT_DIR}/logs:/usr/src/app/logs --env-file env.list -p ${EXPOSE_PORT}:${PORT} ${DOCKER_IMAGE_NAME}:${BUILD_ID}'
                    // sh 'docker exec -i ${DOCKER_IMAGE_NAME}-${BUILD_ID} npm run migrations:run:prod'
                    // sh 'docker exec -i ${DOCKER_IMAGE_NAME}-${BUILD_ID} npm run start:prod'
                }

                // sh 'docker run -d -t --name ${DOCKER_IMAGE_NAME}-${BUILD_ID} -v ${PATH_NODE_MODULES}:/usr/src/app/node_modules -w /usr/src/app -p ${EXPOSE_PORT}:${PORT} ${DOCKER_IMAGE_NAME}'
            }
        }
    }

    post {
        always {
            step([$class: "WsCleanup"])
            cleanWs()
        }
    }
}