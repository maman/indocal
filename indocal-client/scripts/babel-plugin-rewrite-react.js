function reactImport(source, specifiers) {
  return source && source.value === 'react' && specifiers.length;
}

module.exports = function({types: t}) {
  return {
    name: 'rewrite react import to use react-native/react on rn/web react',
    visitor: {
      ImportDeclaration(path, state) {
        if (path.node.__processed) return;
        if (
          state.file.opts.filename.includes('node_modules') ||
          state.file.opts.filename.includes('index.native.js')
        )
          return;
        if (state.opts.mode !== 'web') {
          if (reactImport(path.node.source, path.node.specifiers)) {
            path.node.source = t.stringLiteral('react-native');
          }
        }
      },
      VariableDeclaration(path, state) {
        if (path.node.__processed) return;
        if (
          state.file.opts.filename.includes('node_modules') ||
          state.file.opts.filename.includes('index.native.js')
        )
          return;
        if (state.opts.mode !== 'web') {
          const declaration = path.node && path.node.declarations[0];
          if (declaration) {
            if (
              reactImport(
                declaration.init &&
                  declaration.init.arguments &&
                  declaration.init.arguments[0],
                declaration.init && declaration.init.arguments
              )
            ) {
              declaration.init = t.callExpression(t.identifier('require'), [
                t.stringLiteral('react-native'),
              ]);
            }
          }
        }
      },
    },
  };
};
