import React from 'react'
import { IoSend } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdKeyboardBackspace } from "react-icons/md";


const Home = () => {
    return (
        <div>
            <div className='home'>
                <div className='left'></div>
                <div className='right'>
                    <div className='righttop'>
                        <div className='user'><FaUserGraduate size={25} style={{cursor: "pointer"}}/>
                        <MdKeyboardBackspace className='backicon' size={25} style={{cursor: "pointer"}}/></div>
                        
                        <div>Name Of The User</div>
                        <PiDotsThreeOutlineVerticalFill size={25} style={{cursor: "pointer"}}/>
                    </div>
                    <div className='rightcenter'></div>
                    <div className='rightbottom'>
                        <div className="sendbar">
                            <input type="text" placeholder='Message' class="form-control" aria-label="Dollar amount (with dot and two decimal places)"/>
                            <IoSend style={{cursor: "pointer"}} className='sendbutton'  color='#e50a82' size={25} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
