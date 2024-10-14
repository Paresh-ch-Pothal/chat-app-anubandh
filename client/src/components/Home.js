import React, { useEffect, useState } from 'react'
import { IoSend } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from 'react-router-dom';


const Home = () => {

    const host = "http://localhost:5000";
    const [userchats, setuserchats] = useState([])
    const token = localStorage.getItem("token");

    const fetchchatsuser = async (req, res) => {
        try {

            const response = await fetch(`${host}/chat/fetchchats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                },
            });
            const json = await response.json()
            console.log(json);
            setuserchats(json);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchchatsuser();
    }, [token])

    return (
        <div>
            <div className='home'>
                <div className='left'>
                    <div style={{ textAlign: "center", fontSize: "20px", color: "white", padding: "10px" }}>Your Chats</div>
                    <div style={{ padding: "10px" }} className='searchUser'><input type="text" placeholder='Search User or Groups' class="form-control" aria-label="Dollar amount (with dot and two decimal places)" /></div>
                    <div className='chats'>
                        {userchats.length === 0 ? (<div style={{color: "white",textAlign: "center"}}>No Chats is present</div>) : (
                            userchats.map((userchat) => {
                                return (
                                    <div key={userchat._id} className='singlechats'>
                                        <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png" height={50} width={50} alt="" />
                                        <div className='chatsdetails'>
                                            <span>{userchat.name}</span>
                                            {userchat.latestMessage && userchat.latestMessage.content ? (
                                                <span>{userchat.latestMessage.content}</span>
                                            ) : (
                                                <span>No New Message</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}


                    </div>
                </div>
                <div className='right'>
                    <div className='righttop'>
                        <div className='user'><FaUserGraduate size={25} style={{ cursor: "pointer" }} />
                            <MdKeyboardBackspace className='backicon' size={25} style={{ cursor: "pointer" }} /></div>
                        <div>Name Of The User</div>
                        <div class="btn-group">
                            <PiDotsThreeOutlineVerticalFill class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" size={25} style={{ cursor: "pointer" }} />
                            <ul class="dropdown-menu">
                                <li><Link class="dropdown-item" to="/profile">View Profile</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className='rightcenter'></div>
                    <div className='rightbottom'>
                        <div className="sendbar">
                            <input type="text" placeholder='Message' class="form-control" aria-label="Dollar amount (with dot and two decimal places)" />
                            <IoSend style={{ cursor: "pointer" }} className='sendbutton' color='#e50a82' size={25} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
