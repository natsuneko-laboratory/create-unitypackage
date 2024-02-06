# @natsuneko-laboratory/create-unitypackage

Create UnityPackage in your GitHub Actions.

## Properties

| Property   | Type       | Required                            | Description                                          |
| ---------- | ---------- | ----------------------------------- | ---------------------------------------------------- |
| `meta`     | `string`   | No (default: `null`) \*             | meta collections                                     |
| `package`  | `string`   | No (default: `null`) \*             | package.json for packaging                           |
| `packages` | `string[]` | No (default: `null`) \*             | array of package.json for packaging                  |
| `root`     | `string`   | No (default: `.`)                   | root directory                                       |
| `output`   | `string`   | Yes if `meta` or `package` provided | output filename such as `Neko.unitypackage`          |
| `outputs`  | `string[]` | Yes if `packages` provided          | array of output filename such as `Neko.unitypackage` |

<small>\* specify one of `meta`, `package`, or `packages`</small>

## Usage

### using `meta`

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
            Assets/NatsunekoLaboratory/Package/**/*.*
          output: ./MetaList

      - run: |
          mkdir ./dist
          cat ./MetaList

      - uses: natsuneko-laboratory/create-unitypackage@main
        with:
          meta: ./MetaList
          output: dist/Package.unitypackage
```

### using `package`

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

      - run: |
          mkdir ./dist

      - uses: natsuneko-laboratory/create-unitypackage@main
        with:
          package: Assets/NatsunekoLaboratory/Package/package.json
          output: dist/Package.unitypackage
```

### using `packages`

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

      - run: |
          mkdir ./dist

      - uses: natsuneko-laboratory/create-unitypackage@main
        with:
          packages: |
            Assets/NatsunekoLaboratory/Package1/package.json
            Assets/NatsunekoLaboratory/Package2/package.json
          outputs: |
            dist/Package1.unitypackage
            dist/Package2.unitypackage
```

## License

MIT by [@6jz](https://to.natsuneko.com/6jz)
