import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'

import App from './App'

import 'antd/dist/antd.css'
// 自定义主题用less
// import 'antd/dist/antd.less'


const root = ReactDOM.createRoot(document.getElementById('app'))

root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
)