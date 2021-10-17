# @wyntau/schematics

This repository have some handy schematics you can use to start a project quickly.

## Usage

```shell
# install dependencies globally
yarn global add @angular-devkit/schematics-cli @wyntau/schematics

# run schematic
schematics @wyntau/schematics:starter-javascript
```

## Schematics

### Starter schematics
These are the real starter you can use to quickly start a project.

- starter-javascript

### Toolchain Schematics

These are some atom schematics you can combine together to add some toolchains to your new/exist project.

- toolchain-eslint
- toolchain-husky
- toolchain-lerna
- toolchain-lint-recently
- toolchain-lint-staged
- toolchain-npm
- toolchain-nvm
- toolchain-patch-package
- toolchain-prettier
- toolchain-typescript
- toolchain-yarn

## Use this in your own schematics
You can see the [`starter-javascript`](src/starter-javascript/index.ts) to find more detail.


## License
MIT
