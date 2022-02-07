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
      - uses: natsuneko-laboratory/create-unitypackage
        with:
          meta: ./meta-list
          root: /path/to/UnityProject
          output: ./some.unitypackage
```

## License

MIT by [Natsune - @6jz](https://twitter.com/6jz)
