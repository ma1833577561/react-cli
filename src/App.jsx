import React, { Suspense, lazy } from "react";
import { Link, Route, Routes } from 'react-router-dom'


const Home = lazy(()=> import(/* webpackChunkName: 'home' */ "./pages/Home"))
const About = lazy(()=> import(/* webpackChunkName: 'about' */ "./pages/About"))

// 懒加载组建过渡内容
const Fallback = (
    <div>
        Loading...
    </div>
)


const App = () => {
    return (
        <>
            <div>hello React Cli App</div>   
            <ul>
                <li><Link to='/home'>home</Link></li>
                <li><Link to='/about'>about</Link></li>
            </ul>
            <Suspense fallback={Fallback}>
                <Routes>
                    <Route path='/home' element={<Home />} />
                    <Route path='/about' element={<About />} />
                </Routes>
            </Suspense>
        </>
    ) 

}
 
export default App