# Fokus(chrome extension)

[![Build Status](https://cloud.drone.io/api/badges/rabelais88/fokus/status.svg)](https://cloud.drone.io/rabelais88/fokus)

Chrome Extension that removes any distractions on the web

# Caveat

## end-to-end testing

For fully automated docker-compose test for e2e testing on Drone-CI, a self-hosted server is required. As it is not affordable at the moment, CI/CD will rely to a single closed image e2e testing.

```sh
# when testing e2e on local machine(docker-compose)
source cypress-up.sh
# when testing e2e on drone-ci cloud
yarn test-e2e-ci
```

# License

- Developed by Sungryeol Park([sungryeolp@gmail.com](mailto:sungryeolp@gmail.com))
- The extension used [react + chrome extension boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react)
