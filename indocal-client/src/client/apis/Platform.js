import React from 'react';
const {Platform} = React;

export default (Platform
  ? Platform
  : {
      OS: 'web',
      select(obj) {
        return obj.web;
      },
    });
