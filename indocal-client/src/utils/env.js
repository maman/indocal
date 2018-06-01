// @flow

function get(_envar: string): string | typeof undefined {
  const envar = process.env[_envar];
  if (envar && envar.length) {
    return envar;
  }
  return undefined;
}

const Env = {
  get,
};

export default Env;
