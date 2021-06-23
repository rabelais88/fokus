# Fokus(chrome extension)

[![Build Status](https://cloud.drone.io/api/badges/rabelais88/fokus/status.svg)](https://cloud.drone.io/rabelais88/fokus)
[![Coverage Status](https://coveralls.io/repos/github/rabelais88/fokus/badge.svg?branch=code-coverage)](https://coveralls.io/github/rabelais88/fokus?branch=code-coverage)<br />
Chrome Extension that blocks websites based on current task

# Installing Nightly Build
1. download latest release from [here](https://github.com/rabelais88/fokus/tags)
2. unpack `.zip`
3. unpack `vX.XX.zip` at desired location
4. turn on `developer mode` from [chrome://extensions/](chrome://extensions/)
5. click `Load Unpacked` and choose the folder that's been picked earlier.

# 개발 버전 설치하기
1. [여기](https://github.com/rabelais88/fokus/tags)에서 최신 릴리즈 버전을 다운로드 합니다.
2. `.zip` 파일을 압축 풀기 합니다.
3. 원하는 위치에 `vX.XX.zip` 파일을 압축 풀기 합니다.
4. [chrome://extensions/](chrome://extensions/)에서 `개발자 모드`를 켭니다.
5. `압축해제된 확장 프로그램을 로드합니다.`를 클릭하여 앞서 선택한 위치의 폴더를 엽니다.

# Caveat

## End-to-end testing

For fully automated docker-compose test for e2e testing on Drone-CI, a self-hosted server is required. As it is not affordable at the moment, CI/CD will rely to a single closed image e2e testing.

```sh
# when testing e2e on local machine(docker-compose)
source cypress-up.sh
# when testing e2e on drone-ci cloud
yarn test-e2e-ci
```

## Disabled features

To make chrome extension marketplace registration easier, some unused features were cut out, especially *content script*. In case the missing features are necessary, check [this git commit](https://github.com/rabelais88/fokus/commit/73a7ee84968b235b43dbe7f32ed07db5a98f146a) to see which features were removed.

## Manifest v3 migration

Migration to chrome extension manifest v3 happened in the middle of development. check [this git commit](https://github.com/rabelais88/fokus/commit/2510253765c3016c3c1ffa2219d39186cfa7eb19) to see which features got changed from manifest v2.

## Browser Support

Chrome supports only at the moment.

## Internationalization

Never, ever locally manipulate locale string. it may cause unwanted side-effects from remote locale server. Use [this locale editor on web](https://simplelocalize.io/dashboard/projects/?hash=0b4769c0031248119d1fd572e2ca708a). If authorization is required, please contact the person who are in charge.

# License

- Developed by Sungryeol Park([sungryeolp@gmail.com](mailto:sungryeolp@gmail.com))
- The extension used [react + chrome extension boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react)
