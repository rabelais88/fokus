LATEST_VERSION=$(git ls-remote --exit-code --refs --tags https://github.com/rabelais88/fokus.git | tail -1 | awk '{print $2}' | grep -Eo "[\.0-9]+")
echo "latest version on github: ${LATEST_VERSION}"
NOW_VERSION=$(cat ./src/manifest.json | grep -Eo '"version": "([\.0-9]+)"' | grep -Eo "[\.0-9]+")
echo "current version on manifest.json: ${NOW_VERSION}"
if [ "$DRONE_COMMIT_BRANCH" != "master" ]; then
	echo "build will not run in non-master branch: ${DRONE_COMMIT_BRANCH}"
	exit 0
fi
if [ "$LATEST_VERSION" != "$NOW_VERSION" ]; then
	echo "build started"
	apt-get update
	apt install zip
	git clone https://github.com/rabelais88/fokus fokus-build
	cd fokus-build
	git checkout master
	# hide secrets from console
	# must use escape secret value with $$
	git remote set-url origin https://rabelais88:${GITHUB_TOKEN}@github.com/rabelais88/fokus.git
	# delete pre-existing release file
	rm -rf release
	rm -f *.zip
	yarn install
	yarn build-release
	VERSION_TAG="v${NOW_VERSION}"
	mv build release
	zip -j -r ${VERSION_TAG}.zip release
	git add .
	git commit -am "versioning ${VERSION_TAG} for release"
	git push -u origin master
	git tag -a $VERSION_TAG -m "build version ${VERSION_TAG} from drone.io"
	git push origin $VERSION_TAG
	echo "build success!"
else
	echo "nothing to build."
fi
