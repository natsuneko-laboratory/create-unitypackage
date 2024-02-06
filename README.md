# @natsuneko-laboratory/create-unitypackage

Create a UnityPackage on GitHub Actions, without Unity Editor

## Properties

| Name         | Type       | Required              | Description                                                                   |
| ------------ | ---------- | --------------------- | ----------------------------------------------------------------------------- |
| `root`       | `string`   | No (default: `cwd()`) | the Unity project root directory                                              |
| `files`      | `string[]` | No (default: `[]`)    | the actual file paths (not meta) to include to unitypackage                   |
| `files-glob` | `string[]` | No (default: `[]`)    | the glob patterns for actual file paths (not meta) to include to unitypackage |
| `dest`       | `string`   | Yes                   | the destination path for creating unitypackage                                |

## Example

```yml
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
      - uses: actions/checkout@v4
        with:
          lfs: true

      - name: create unitypackage from files
        uses: natsuneko-laboratory/create-unitypackage@v3
        with:
          files: |
            ./Assets/NatsunekoLaboratory/MonoBehaviour.cs
            ./Assets/NatsunekoLaboratory/Resources/Logo.png
          dest: test.unitypackage

      - name: create unitypackage from glob pattern
        uses: natsuneko-laboratory/create-unitypackage@v3
        with:
          files-glob: |
            ./Assets/NatsunekoLaboratory/**/*.cs
          dest: test.unitypackage
```

## License

MIT by [@6jz](https://to.natsuneko.com/6jz)
