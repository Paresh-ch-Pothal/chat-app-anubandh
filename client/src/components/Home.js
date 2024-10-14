import React, { useEffect, useState } from 'react'
import { IoSend } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link, Navigate, useNavigate } from 'react-router-dom';


const Home = () => {

    const host = "http://localhost:5000";
    const [userchats, setuserchats] = useState([])
    const token = localStorage.getItem("token");
    let navigate = useNavigate();
    const [chatId, setchatId] = useState("");
    const [participants, setparticipants] = useState([])
    const [profile, setprofile] = useState({})

    const handleprofile = async () => {
        try {
            const response = await fetch(`${host}/user/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                },
            });
            const json = await response.json();
            console.log(json);
            setprofile(json);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleprofile();
    }, [token])

    const fetchchatsuser = async () => {
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


    const handleLogout = async () => {
        localStorage.removeItem("token");
        navigate("/signup")
    }

    const handleclickchats = (e) => {
        console.log(e)
        setchatId(e);
    }

    const fetchparticipants = async (chatId) => {
        try {
            const response = await fetch(`${host}/chat/fetchparticipants/${chatId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const json = await response.json()
            console.log(json);
            console.log(json.participants);
            setparticipants(json)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        if (chatId) {
            fetchparticipants(chatId);
        }
    }, [chatId]);



    return (
        <div>
            <div className='home'>
                <div className='left'>
                    <div style={{ textAlign: "center", fontSize: "20px", color: "white", padding: "10px" }}>

                        Your Chats
                    </div>
                    <div style={{ padding: "10px",display: "flex",gap: "5px" }} className='searchUser'>
                        <button type="button" className="btn btn-info">Users</button>
                        <input type="text" placeholder='Search User or Groups' className="form-control" aria-label="Dollar amount (with dot and two decimal places)" /></div>
                    <div className='chats'>
                        {userchats.length === 0 ? (<div style={{ color: "white", textAlign: "center" }}>No Chats is present</div>) : (
                            userchats.map((userchat) => {
                                return (
                                    <div onClick={() => { handleclickchats(userchat._id) }} key={userchat._id} className='singlechats'>
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
                        <div className='user'>
                            <FaUserGraduate data-bs-toggle="modal" data-bs-target="#staticBackdrop" size={25} style={{ cursor: "pointer" }} />

                            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Participants</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            {participants.length === 0 ? (
                                                <div>No Users are present</div>
                                            ) : (participants.participants.map((user) => {
                                                return (
                                                    <div key={user._id} className='singlechats my-2'>
                                                        <img src={user.pic ? user.pic : "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png"} height={50} width={50} alt="" />
                                                        <div className='chatsdetails'>
                                                            {user.name === profile.name ? (<span>You</span>) : (<span>{user.name}</span>)}
                                                            <span>Batch: {user.batch}</span>
                                                        </div>
                                                    </div>
                                                )
                                            }))}

                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <MdKeyboardBackspace className='backicon' size={25} style={{ cursor: "pointer" }} /></div>
                        <div>{participants.IsDomainSpecific ? (<h5>Domain: {participants.name}</h5>) : (
                            participants.isBatchChat ? (<h5>Batch: {participants.name}</h5>) : (<h5>{participants.name}</h5>)
                        )}</div>
                        <div className="btn-group">
                            <PiDotsThreeOutlineVerticalFill className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" size={25} style={{ cursor: "pointer" }} />
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/profile">View Profile</Link></li>
                                <li><Link onClick={handleLogout} className="dropdown-item">Logout</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className='rightcenter'></div>
                    <div className='rightbottom'>
                        <div className="sendbar">
                            <input type="text" placeholder='Message' className="form-control" aria-label="Dollar amount (with dot and two decimal places)" />
                            <IoSend style={{ cursor: "pointer" }} className='sendbutton' color='#e50a82' size={25} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
