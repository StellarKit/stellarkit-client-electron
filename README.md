# Stellar Client

A destop app that wraps much of the [`js-stellar-sdk`](https://github.com/stellar/js-stellar-sdk). Apps can be built for win/macos/linux

This is an [`Electron application`](https://electronjs.org/) wrapper around the [`stellar-client-web`](https://github.com/StellarKit/stellar-client-web) project.  

To build and run:
```
yarn install
yarn dev
```
To build installer
```
yarn dist
```

If things don't build right, try deleting yarn.lock, then yarn install to get everything fresh

### Donations
If you like the code, a donation would be appreciated. Even a single XLM!

Click here for the [`donation page`](https://stellarkit.io/#/donate). Nano support!

```
XLM: GCYQSB3UQDSISB5LKAL2OEVLAYJNIR7LFVYDNKRMLWQKDCBX4PU3Z6JP
```

### More Info

> A project developed with [`electron-webpack`](https://github.com/electron-userland/electron-webpack).

A client for Stellar that uses the StellarSDK

Thanks to the power of `electron-webpack` this template comes packed with...

* Use of [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server) for development
* HMR for both `renderer` and `main` processes
* Use of [`babel-preset-env`](https://github.com/babel/babel-preset-env) that is automatically configured based on your `electron` version
* Use of [`electron-builder`](https://github.com/electron-userland/electron-builder) to package and build a distributable electron application

Make sure to check out [`electron-webpack`'s documentation](https://webpack.electron.build/) for more details.

### Getting Started
Simply clone down this reposity, install dependencies, and get started on your application.

The use of the [yarn](https://yarnpkg.com/) package manager is **strongly** recommended, as opposed to using `npm`.

```
bash
# create a directory of your choice, and copy template using curl
mkdir new-electron-webpack-project && cd new-electron-webpack-project
curl -fsSL https://github.com/electron-userland/electron-webpack-quick-start/archive/master.tar.gz | tar -xz --strip-components 1

# or copy template using git clone
git clone https://github.com/electron-userland/electron-webpack-quick-start.git
cd electron-webpack-quick-start
rm -rf .git

# install dependencies
yarn
```

### Development Scripts

```
bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```
