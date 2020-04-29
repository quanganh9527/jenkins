import groovy.json.JsonOutput
def notifySlack(color, text, channel) {
    def jenkinsIcon = 'https://wiki.jenkins-ci.org/download/attachments/2916393/logo.png'
    def payload = JsonOutput.toJson([color     : color,
                                     text      : text,
                                     channel   : channel,
                                     username  : "jenkins",
                                     icon_url  : jenkinsIcon])
    sh "curl -X POST --data-urlencode \'payload=${payload}\' ${SLACK}"
}

pipeline {
  agent {
      docker { image 'node' }
  }
  environment {
    ORG = 'infodation'
    APP_NAME = 'eeac-portal'
    CHARTMUSEUM_CREDS = credentials('jenkins-x-chartmuseum')
    DOCKER_REGISTRY_ORG = 'ee-acco'
    SLACK = credentials('slackwebhook')
	SLACK_CHANNEL = 'ee-acco'
	MSG_PREFIX = '[EE-Acco][eeac-portal]'
  }
  stages {
    stage('CI Build and push snapshot') {
      when {
        branch 'PR-*'
      }
      environment {
        PREVIEW_VERSION = "0.0.0-SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
        PREVIEW_NAMESPACE = "$APP_NAME-$BRANCH_NAME".toLowerCase()
        HELM_RELEASE = "$PREVIEW_NAMESPACE".toLowerCase()
        DOCKER_CREDENTIAL = credentials('azurecr')	
      }
      steps {
        container('nodejs') {
          sh "jx step credential -s npm-token -k file -f /builder/home/.npmrc --optional=true"
          sh "yum install -y libpng-devel --disablerepo=epel"
          sh "yarn install"
          sh "yarn build"
          sh "export VERSION=$PREVIEW_VERSION && skaffold build -f skaffold.yaml"
          sh "jx step post build --image $DOCKER_REGISTRY/$ORG/$APP_NAME:$PREVIEW_VERSION"
          dir('./charts/preview') {
            sh "make preview"
		    sh "kubectl delete user x-0 -n ee-acco || true" //temporary workaround to avoid BitBucket API failure
            sh "jx preview --app $APP_NAME --dir ../.."
            sh "kubectl create secret docker-registry regcred --docker-server=infodation.azurecr.io --docker-username=$DOCKER_CREDENTIAL_USR --docker-password=$DOCKER_CREDENTIAL_PSW --docker-email=tu.doan@infodation.vn -n ee-acco-infodation-${PREVIEW_NAMESPACE} || true"
          }
        }
      }
    }
    stage('Build Release') {
      when {
        branch 'master'
      }
      steps {
        container('nodejs') {

          // ensure we're not on a detached head
          sh "git checkout master"
          sh "git config --global credential.helper store"
          sh "jx step git credentials"

          // so we can retrieve the version in later steps
          sh "echo \$(jx-release-version) > VERSION"
          sh "jx step tag --version \$(cat VERSION)"
          sh "jx step credential -s npm-token -k file -f /builder/home/.npmrc --optional=true"
		  sh "yum install -y libpng-devel --disablerepo=epel"
          sh "yarn install"
		  sh "yarn upgrade"
          sh "yarn build"			 
          sh "export VERSION=`cat VERSION` && skaffold build -f skaffold.yaml"
          sh "jx step post build --image $DOCKER_REGISTRY/$ORG/$APP_NAME:\$(cat VERSION)"
        }
      }
    }
    stage('Promote to Environments') {
      when {
        branch 'master'
      }
      steps {
        container('nodejs') {
          dir('./charts/eeac-portal') {
            sh "jx step changelog --batch-mode --version v\$(cat ../../VERSION)"
            // release the helm chart
            sh "jx step helm release"
            // promote through all 'Auto' promotion Environments
            sh "jx promote -b --all-auto --timeout 1h --version \$(cat ../../VERSION)"
          }
        }
      }
    }
  }
  post {
        always {
          cleanWs()
        }
		failure {
          container('nodejs') {
             notifySlack('#8d021f', "${MSG_PREFIX} <!channel> The build has been stopped by errors, please check the (<${env.BUILD_URL}console|build logs>)", "${SLACK_CHANNEL}")
          }
        }		   
  }
}
