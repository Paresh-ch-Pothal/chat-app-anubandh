import React from 'react'
import { IoSend } from "react-icons/io5";

const Home = () => {
    return (
        <div>
            <div className='home'>
                <div className='left'></div>
                <div className='right'>
                    <div className='righttop'>
                        hello
                    </div>
                    <div className='rightcenter'></div>
                    <div className='rightbottom'>
                        <div className="sendbar">
                            <input type="text" placeholder='Message' class="form-control" aria-label="Dollar amount (with dot and two decimal places)"/>
                            <IoSend className='sendbutton' color='#e50a82' size={25} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
