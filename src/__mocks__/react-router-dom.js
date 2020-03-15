import React from 'react';
import ReactRouterDom from 'react-router-dom';

ReactRouterDom.BrowserRouter = ({children}) => <div>{children}</div>

module.exports = ReactRouterDom;
