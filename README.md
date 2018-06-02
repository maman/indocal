# Indocal

## Preamble

TBD

## Technical Stuff

This project is using [Yarn Workspaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/) to do a monorepo-styled repository. Run `yarn` on `indocal` root directory after cloning to install all dependencies.
This will install all package dependencies, setup githooks with [husky](https://github.com/typicode/husky), and install flowtype definitions with [flow-typed](https://github.com/flowtype/flow-typed).

### Client

The client is a react app that runs on both web (with SSR + Codesplitting!) and native. these commands are available:

```sh
($indocal-client) yarn develop #run development-server
($indocal-client) yarn develop:rn:<platform> # run react-native on ios/android emulators
($indocal-client) yarn build #build web distribution package
($indocal-client) yarn build:rn:<platform> #build platform-independent distribution package (TBD)
($indocal-client) yarn start #run web distribution in production-mode (do yarn build first before run this command)
```

You can run `yarn develop` and `yarn develop:rn:<platform>` in parallel, so you can develop for both platform simultaneously. The development server is HMR-enabled, so for most cases you can see changes without reloading the app.

##### Interesting files

If you're interested to know how we do multi-platform rendering with SSR, codesplit and HMR, you might see the following:

1.  [createServer.js#L48-L103](https://github.com/maman/indocal/blob/master/indocal-client/src/server/createServer.js#L48-L103) (Server-side HMR Logic)
2.  [necolas/react-native-web](https://github.com/necolas/react-native-web) (Rendering react on both web and native - need to patch this with [this patch](indocal-client/__HACKS/react-native-web-ResponderEventInjection.patch))
3.  [faceyspacey/react-universal-component](https://github.com/faceyspacey/react-universal-component), [faceyspacey/webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks) (Code-splitting logic)

### API

The api is an express server that serves graphql api. These commands are available:

```sh
($indocal-api) yarn develop #run server in development-mode(tbd)
($indocal-api) yarn build #build service for distribution(tbd)
($indocal-api) yarn start #run service distribution in production-mode(tbd)
```

This graphql server will be used by client, both in web, native, and SSR mode.
