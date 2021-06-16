# Fokus(chrome extension)

[![Build Status](https://cloud.drone.io/api/badges/rabelais88/fokus/status.svg)](https://cloud.drone.io/rabelais88/fokus)<br/>
Chrome Extension that blocks websites based on current task

# Caveat

## end-to-end testing

For fully automated docker-compose test for e2e testing on Drone-CI, a self-hosted server is required. As it is not affordable at the moment, CI/CD will rely to a single closed image e2e testing.

```sh
# when testing e2e on local machine(docker-compose)
source cypress-up.sh
# when testing e2e on drone-ci cloud
yarn test-e2e-ci
```

## disabled features

To make chrome extension marketplace registration easier, some unused features were cut out, especially *content script*. In case the missing features are necessary, check [this git commit](https://github.com/rabelais88/fokus/commit/73a7ee84968b235b43dbe7f32ed07db5a98f146a) to see which features were removed.

## manifest v3 migration

Migration to chrome extension manifest v3 happened in the middle of development. check [this git commit](https://github.com/rabelais88/fokus/commit/2510253765c3016c3c1ffa2219d39186cfa7eb19) to see which features got changed from manifest v2.

## Browser Support

Chrome supports only at the moment.

## internationalization

Never, ever locally manipulate locale string. it may cause unwanted side-effects from remote locale server. Use [this locale editor on web](https://simplelocalize.io/dashboard/projects/?hash=0b4769c0031248119d1fd572e2ca708a). If authorization is required, please contact the person who are in charge.

# License

- Developed by Sungryeol Park([sungryeolp@gmail.com](mailto:sungryeolp@gmail.com))
- The extension used [react + chrome extension boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react)
