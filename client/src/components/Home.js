import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import { FaFileImage } from "react-icons/fa6";
import { ToastContainer, Slide, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

var socket, selectedChatCompare;
const Home = () => {

    const host = "http://localhost:5000";
    const ENDPOINT = "http://localhost:5000";
    const [userchats, setuserchats] = useState([])
    const token = localStorage.getItem("token");
    let navigate = useNavigate();
    const [chatId, setchatId] = useState("");
    const [participants, setparticipants] = useState([])
    const [profile, setprofile] = useState({})
    const [users, setusers] = useState([])
    const [messages, setmessages] = useState([])
    const [newMessage, setnewMessage] = useState("");

    const [socketConnected, setSocketConnected] = useState(false);
    const [image, setimage] = useState("");
    const [pic, setpic] = useState("");
    const sendimagefile = useRef(null);

    // useEffect(() => {
    //     socket = io(ENDPOINT);
    //     socket.emit("setup", profile);
    //     socket.on('connected', () => setSocketConnected(true));
    //     socket.on("message received", (newMessageReceived) => {
    //         if (!selectedChatCompare || selectedChatCompare !== newMessageReceived.chatId._id) {
    //             return;
    //         }
    //         setmessages(prevMessages => [...prevMessages, newMessageReceived]);
    //     });
    //     socket.on('disconnect', () => {
    //         setSocketConnected(false);
    //         // Optionally attempt reconnection or handle the state
    //     });
    //     return () => {
    //         socket.off("message received");
    //         socket.disconnect();
    //     };
    // }, []);


    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", profile);

        socket.on('connected', () => setSocketConnected(true));

        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare !== newMessageReceived.chatId._id) {
                return;
            }

            setmessages(prevMessages => {
                // Check if the message is already in the list
                const messageExists = prevMessages.some(
                    (message) => message._id === newMessageReceived._id
                );

                if (messageExists) {
                    return prevMessages; // No update needed
                } else {
                    return [...prevMessages, newMessageReceived];
                }
            });
        });

        socket.on('disconnect', () => {
            setSocketConnected(false);
            // Optionally attempt reconnection or handle the state
        });

        return () => {
            socket.off("message received");
            socket.disconnect();
        };
    }, []);




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

    const fetchallusers = async () => {
        try {
            const response = await fetch(`${host}/user/fetchalluser`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                }
            });
            const json = await response.json()
            console.log(json.users)
            setusers(json.users);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchallusers();
    }, [])


    const handleSingleChats = async (e) => {
        try {
            const response = await fetch(`${host}/chat/singlechat`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                },
                body: JSON.stringify({ userId: e })
            });
            const json = await response.json()
            console.log(json);
        } catch (error) {
            console.log(error)
        }
    }





    const fetchMessage = async () => {
        try {
            const response = await fetch(`${host}/message/fetchmessage/${chatId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                },

            });
            const json = await response.json();
            console.log(json)
            setmessages(json.messages)
            socket.emit("join chat", chatId);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (chatId) {
            fetchMessage();
            selectedChatCompare = chatId;
        }
    }, [chatId])

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = null;
            if (image && (image.type === "image/jpeg" || image.type === 'image/png')) {
                const picData = new FormData();
                picData.append('file', image);
                picData.append('upload_preset', 'chat-app');
                picData.append('cloud_name', 'dubm71ocj');



                try {
                    const res = await fetch('https://api.cloudinary.com/v1_1/dubm71ocj/image/upload', {
                        method: 'POST',
                        body: picData,
                    });
                    const result = await res.json();
                    imageUrl = result.secure_url;

                    console.log("Uploaded Image URL:", imageUrl);
                } catch (err) {
                    console.error("Image upload failed:", err);
                    return;
                }
            }
            const messageData = {
                content: newMessage,
                chatId: chatId,
                image: imageUrl || null
            };
            console.log(messageData)

            const response = await fetch(`${host}/message/sendmessage`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                },
                body: JSON.stringify(messageData)
            });
            const json = await response.json();
            console.log("Message sent:", json);
            setnewMessage("");
            setimage(null);
            setmessages(prevMessages => [...prevMessages, json.message]);
            socket.emit("new message", json.message);

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.type === 'image/jpeg' || file.type === "image/png") {
            setimage(file);
            toast.success('File Uploaded Successfully just click send', {
                position: "bottom-center",
                autoClose: 1600,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide,
            });

        }
        else {
            toast.error('The file is not jpeg or png type', {
                position: "bottom-center",
                autoClose: 1600,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide,
            });
        }
    };


    const [modal, setmodal] = useState(false)
    const [clickimage, setclickImage] = useState("")
    const handleImageClick = (image) => {
        setmodal(true)
        setclickImage(image)
    }

    const [searchusers, setsearchUsers] = useState([])
    const [search, setsearch] = useState(false);
    const [searchValue, setsearchValue] = useState('')

    const handleSearchuser = async () => {
        try {
            const response = await fetch(`${host}/user/searchuser?search=${searchValue}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token

                },
            })
            const json = await response.json()
            setsearchUsers(json.users || []);
            setsearch(true)
        } catch (error) {
            console.log(error);
        }
    }

    const searchOnchange = (e) => {
        setsearchValue(e.target.value)
        setsearch(false)
    }

    const handledeleteChat = async () => {
        try {
            const response = await fetch(`${host}/chat/deletechat/${chatId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token

                },
            })
            const json = await response.json()
            if (json.success) {
                toast.success(json.message, {
                    position: "top-left",
                    autoClose: 1600,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Slide,
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const datefromCreatedAtFormatted = (createdAt) => {
        const dateObj = new Date(createdAt);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);
        return formattedDate;
    };

    const dateFromCreatedNotFormatted = (createdAt) => {
        const dateObj = new Date(createdAt);
        const date = dateObj.toLocaleDateString();
        return date;
    }

    const timeFromCreatedAt = (createdAt) => {
        const dateObj = new Date(createdAt);
        const options = { hour: '2-digit', minute: '2-digit', hour12: false };
        const time = dateObj.toLocaleTimeString('en-GB', options);

        return time;
    };


    const isToday = (date) => {
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    const handleDeleteMessage = async (messageId) => {
        console.log(messageId)
        try {
            const response = await fetch(`${host}/message/deletemessage/${messageId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                },
            })
            const json = await response.json();
            console.log(json)
            if (json.success) {
                toast.success(json.message, {
                    position: "top-left",
                    autoClose: 1600,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Slide,
                });
            }
            else {
                toast.error(json.message, {
                    position: "top-left",
                    autoClose: 1600,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Slide,
                });
            }
        } catch (error) {

        }
    }

    const [editmessage, setEditmessage] = useState("")
    const handleEditMessage = async (e) => {
        console.log(e);
    }



    return (
        <div>

            <div className='home'>
                <ToastContainer
                    position="top-left"
                    autoClose={1600}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition={Slide}
                />
                <div className='left'>
                    <div style={{ textAlign: "center", fontSize: "20px", color: "white", padding: "10px" }}>

                        Your Chats
                    </div>
                    <div style={{ padding: "10px", display: "flex", gap: "5px" }} className='searchUser'>

                        {/* // side drawer starts */}
                        <div>
                            <button className="btn" style={{ width: "27.5vw", backgroundColor: "#f6d4f6" }} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                                Chat With Others
                            </button>

                            <div className="offcanvas offcanvas-start" style={{ backgroundColor: "#2a2d33", color: "white", overflowY: "scroll" }} tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                                <div className="offcanvas-header">
                                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">All Users</h5>
                                    <button type="button" style={{ filter: "invert(100)" }} className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <div>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <input type="text" placeholder='Search User or Groups' className="form-control" aria-label="Dollar amount (with dot and two decimal places)" id='search' name='search' value={searchValue} onChange={searchOnchange} />
                                            <button type="button" className="btn btn-info" onClick={handleSearchuser}>Search</button>
                                        </div>

                                        {search === false ? (
                                            users.length === 0 ? (
                                                <div>No Users are present</div>
                                            ) : (
                                                users.map((user) => {
                                                    return (
                                                        <div onClick={() => handleSingleChats(user._id)} key={user._id} className='singlechats my-3'>
                                                            <img src={user.pic} height={50} width={50} alt="" />
                                                            <div style={{ color: "black" }} className='chatsdetails'>
                                                                <span>{user.name}</span>
                                                                <span>Batch: {user.batch}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )
                                        ) : (
                                            searchusers.length === 0 ? (
                                                <div>No Users are present</div>
                                            ) : (
                                                searchusers.map((user) => {
                                                    return (
                                                        <div onClick={() => handleSingleChats(user._id)} key={user._id} className='singlechats my-3'>
                                                            <img src={user.pic} height={50} width={50} alt="" />
                                                            <div style={{ color: "black" }} className='chatsdetails'>
                                                                <span>{user.name}</span>
                                                                <span>Batch: {user.batch}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )
                                        )}


                                    </div>
                                    <div className="dropdown mt-3">
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* // side drawer ends */}


                    </div>
                    <div className='chats'>
                        {userchats.length === 0 ? (<div style={{ color: "white", textAlign: "center" }}>No Chats is present</div>) : (
                            userchats.map((userchat) => {
                                return (
                                    <div onClick={() => { handleclickchats(userchat._id) }} key={userchat._id} className='singlechats'>
                                        <img
                                            src={
                                                userchat.IsDomainSpecific
                                                    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0hmziKrZ_PcL3b_g16f_SwnXXRLpFD3ZgvQ&s" // Domain-specific chat image
                                                    : userchat.isBatchChat
                                                        ? "https://allpngfree.com/apf-prod-storage-api/storage/thumbnails/batch-png-images-thumbnail-1643730708.jpg" // Batch-specific chat image
                                                        : userchat.participants[0]._id === profile._id
                                                            ? userchat.participants[1].pic  // Show the second participant's pic if the first one is the logged-in user
                                                            : userchat.participants[0].pic  // Otherwise, show the first participant's pic
                                            }
                                            height={50}
                                            width={50}
                                            alt="chat image"
                                        />
                                        <div className='chatsdetails'>
                                            <span>
                                                {userchat.name === "sender"
                                                    ? userchat.participants[0]._id === profile._id
                                                        ? userchat.participants[1].name
                                                        : userchat.participants[0].name
                                                    : userchat.name
                                                }
                                            </span>
                                            {userchat.latestMessage ? (
                                                userchat.latestMessage.content ? (
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <span>
                                                            {userchat.latestMessage.content.length > 20
                                                                ? userchat.latestMessage.content.slice(0, 20) + '...'
                                                                : userchat.latestMessage.content}
                                                        </span>
                                                        <span>{timeFromCreatedAt(userchat.latestMessage.createdAt)}</span>
                                                    </div>
                                                ) : userchat.latestMessage.image ? (
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <span>Image</span>
                                                        <span>{timeFromCreatedAt(userchat.latestMessage.createdAt)}</span>
                                                    </div>
                                                ) : (
                                                    <span>No New Message</span>
                                                )
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
                        <div>
                            {participants.IsDomainSpecific ? (
                                <h5>Domain: {participants.name}</h5>
                            ) : participants.isBatchChat ? (
                                <h5>Batch: {participants.name}</h5>
                            ) : (
                                <h5>
                                    {participants.name === "sender"
                                        ? participants.participants[0]._id === profile._id
                                            ? participants.participants[1].name
                                            : participants.participants[0].name
                                        : participants.name}
                                </h5>
                            )}
                        </div>

                        <div className="btn-group">
                            <PiDotsThreeOutlineVerticalFill className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" size={25} style={{ cursor: "pointer" }} />
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/profile">View Profile</Link></li>
                                <li><Link onClick={handleLogout} className="dropdown-item">Logout</Link></li>
                                <li><Link onClick={handledeleteChat} className="dropdown-item">Delete Chat</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className='rightcenter'>
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.sender._id === profile._id ? 'my-message' : 'other-message'}>

                                <div data-bs-toggle="dropdown" aria-expanded="false" className='message-bubble'>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item" onClick={() => { handleDeleteMessage(msg._id) }} >Delete</Link></li>
                                    </ul>
                                    {/* <img src={msg.sender.pic} alt={msg.sender.name} height={30} width={30} />
                                    <span>{msg.sender.name}</span> : */}
                                    {msg.image ? (
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                            <img src={msg.image} onClick={() => { handleImageClick(msg.image) }} alt="Message attachment" style={{ maxWidth: "300px", maxHeight: "300px", marginTop: "10px" }} />
                                            <div>
                                                <span className='mx-2'>{msg.sender.name}</span>
                                                <span>{msg.content}</span>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <small style={{ fontSize: "12px" }} className="text-body-secondary">{dateFromCreatedNotFormatted(msg.createdAt)}</small>
                                                    <small style={{ fontSize: "12px" }} className="text-body-secondary">{timeFromCreatedAt(msg.createdAt)}</small>
                                                </div>
                                            </div>
                                            {/* <img src={msg.sender.pic} alt={msg.sender.name} height={30} width={30} /> */}

                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", gap: "7px", justifyContent: "center", alignItems: "center" }}>
                                            <img src={msg.sender.pic} alt={msg.sender.name} height={30} width={30} />
                                            <span>{msg.sender.name}</span> :
                                            <span>{msg.content}</span>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <small style={{ fontSize: "12px" }} className="text-body-secondary">{dateFromCreatedNotFormatted(msg.createdAt)}</small>
                                                <small style={{ fontSize: "12px" }} className="text-body-secondary">{timeFromCreatedAt(msg.createdAt)}</small>
                                            </div>
                                        </div>
                                    )}


                                </div>
                                {
                                    modal && (
                                        <div className='modalStyle' onClick={() => setmodal(false)}>
                                            <img
                                                src={clickimage}
                                                alt="Large view"
                                                style={{ maxWidth: "90%", maxHeight: "90%", margin: "auto", display: "block" }}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                        ))}
                    </div>
                    <div className='rightbottom'>
                        <div className="sendbar">
                            <input type="text" id='newMessage' name='newMessage' value={newMessage} onChange={(e) => { setnewMessage(e.target.value) }} placeholder='Message' className="form-control" aria-label="Dollar amount (with dot and two decimal places)" />
                            <input
                                onChange={handleFileChange}
                                type="file"
                                ref={sendimagefile}
                                style={{ display: 'none' }}
                            />
                            <FaFileImage onClick={() => sendimagefile.current.click()} size={25} color='#92ce92' style={{ cursor: "pointer" }} />
                            <IoSend onClick={handleSendMessage} style={{ cursor: "pointer" }} className='sendbutton' color='#e50a82' size={25} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
