# @natsuneko-laboratory/create-unitypackage

Create UnityPackage in your GitHub Actions.

## Usage

```yaml
job:
  deploy:
    name: deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: create-unitypackage@v1
        with:
          meta: ./meta-list
          root: /path/to/UnityProject
          output: ./some.unitypackage
```
