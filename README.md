# @natsuneko-laboratory/create-unitypackage

Create UnityPackage in your GitHub Actions.

## Properties

| Property | Type     | Required          | Description                                 |
| -------- | -------- | ----------------- | ------------------------------------------- |
| `meta`   | `string` | Yes               | meta collections                            |
| `root`   | `string` | No (default: `.`) | root directory                              |
| `output` | `string` | Yes               | output filename such as `Neko.unitypackage` |

## Usage

```yaml
name: "Release by Tag"

on:
  push:
    tags:
      - v\d+\.\d+\.\d+
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          lfs: true

      - uses: natsuneko-laboratory/get-meta-from-glob@main
        with:
          includes: |
            Assets/NatsunekoLaboratory/RefinedAnimationProperty/**/*.*
          output: ./MetaList

      - run: |
          mkdir ./dist
          cat ./MetaList

      - uses: natsuneko-laboratory/create-unitypackage@main
        with:
          meta: ./MetaList
          output: dist/RefinedAnimationProperty.unitypackage
```

## License

MIT by [Natsune - @6jz](https://twitter.com/6jz)
