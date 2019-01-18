pipeline {
	agent any

	stages {
		stage ("Build"){
			steps {
				sh 'docker build -t transactions-gui:0.1.${BUILD_NUMBER} .'
				sh 'docker create --name=transactions-gui_0.1.${BUILD_NUMBER} transactions-gui:0.1.${BUILD_NUMBER}'

				sh 'docker cp $(docker ps -a -q --filter "name=^/transactions-gui_0.1.${BUILD_NUMBER}$"):/tmp/ .'
			}
		}

		stage ("Linter"){
			steps {
				sh "sed -i -e \'s|/usr/src/app|${WORKSPACE}|g\' ./tmp/eslint.xml"
				step([$class: 'WarningsPublisher',
					parserConfigurations: [[
						parserName: 'JSLint',
						pattern: 'tmp/eslint.xml'
					]],
					unstableTotalAll: '0',
					usePreviousBuildAsReference: true
				])
			}
		}

		stage ("Test"){
			steps {
				sh 'touch tmp/unittest.xml'
				junit 'tmp/unittest.xml'
			}
		}

		stage ("Code coverage"){
			steps {
				step([$class: 'CoberturaPublisher', autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: '**/coverage.xml', failUnhealthy: false, failUnstable: false, maxNumberOfBuilds: 0, onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false])
			}
		}

		stage ("Publish"){
			steps {
				withCredentials([usernamePassword(credentialsId: 'DOCKER_CREDENTIALS', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
					sh 'docker login --username ${DOCKER_USERNAME} --password ${DOCKER_PASSWORD}'
					sh 'docker tag transactions-gui:0.1.${BUILD_NUMBER} ${DOCKER_NS}/transactions-gui-angularjs:${VERSION}'
					sh 'docker push ${DOCKER_NS}/transactions-gui-angularjs:${VERSION}'
				}			
			}
		}
	}
}