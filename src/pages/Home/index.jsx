import React from "react";
import bg from './home.jpeg'

const Home = () => {
    return <div style={{width:'100%',height:'100%'}}>
        <img src={bg} alt="" style={{width:'100%',height:'100%'}}/>
    </div>
}
export default React.memo(Home,()=>true)