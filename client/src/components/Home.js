import React, { useState } from 'react'
import { RiCloseLargeFill } from "react-icons/ri";
import { SlClose } from "react-icons/sl";
import { FaUser } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoSendSharp } from "react-icons/io5";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";

const Home = () => {

    const [showchats, setshowchats] = useState(false)

    const handleshowchats = () => {
        setshowchats(true);
    };


    return (
        <>
            <div className='screen'>
                <div className='left'>
                    <div className='left1' >
                        {/* <RiCloseLargeFill color='white' size={30} /> */}
                        <div className='chathead'>Your Chats</div>
                    </div>

                    <div className='left2'>
                        <ul className='left2-ul'>
                            <div className='line'></div>
                            <li className="list-group-item d-flex justify-content-between align-items-start p-3" style={{ width: "94%", color: "white" }}>
                                <CgProfile size={25} />
                                <div className="ms-2 me-auto">

                                    <div className="fw-bold mx-2">Subheading</div>
                                </div>
                                <span className="badge text-bg-primary rounded-pill">14</span>

                            </li>
                            <div className='line'></div>

                            <li className="list-group-item d-flex justify-content-between align-items-start p-3" style={{ width: "94%", color: "white" }}>
                                <CgProfile size={25} />
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold mx-2">Subheading</div>
                                </div>
                                <span className="badge text-bg-primary rounded-pill">14</span>
                            </li>
                            <div className='line'></div>
                            <li className="list-group-item d-flex justify-content-between align-items-start p-3" style={{ width: "94%", color: "white" }}>
                                <CgProfile size={25} />
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold mx-2">Subheading</div>
                                </div>
                                <span className="badge text-bg-primary rounded-pill">14</span>
                            </li>
                            <div className='line'></div>
                            <li className="list-group-item d-flex justify-content-between align-items-start p-3" style={{ width: "94%", color: "white" }}>
                                <CgProfile size={25} />
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold mx-2">Subheading</div>
                                </div>
                                <span className="badge text-bg-primary rounded-pill">14</span>
                            </li>
                            <div className='line'></div>
                        </ul>
                    </div>
                </div>
                <div className='right'>
                    <div className='righttop'>
                        <div className='righttopback'>
                            <MdOutlineArrowBackIos className='backicon' onClick={handleshowchats} size={30}/>
                            <FaUserTie size={25} className='mx-3' />
                        </div>
                    </div>
                    <div className='rightbottom'>
                        <div className='rightbinput'>
                            <input type="search" placeholder='send' />
                        </div>
                        <div className='rightbsend'>
                            <IoSendSharp size={25} color='white' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home




