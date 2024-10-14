import React from 'react'

const Profile = () => {
    return (
        <div style={{backgroundColor: "#2a2d33",color: "white",height: "100vh",width: "100%",display: "flex",justifyContent: "center",alignItems: "center"}}>
            <div className="card" style={{width: "18rem"}}>
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
        </div>
    )
}

export default Profile
