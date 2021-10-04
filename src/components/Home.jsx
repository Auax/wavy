import React from "react";
import { withRouter, Link } from "react-router-dom";
import { useState, useEffect } from 'react';

import Card from "./Card";

const Home = () => {

	// Fetch API data
	const [data, setData] = useState([{}]);
	useEffect(() => {
		fetch("https://wavy-chat.herokuapp.com/api/rooms")
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				console.log("API endpoint data retrieved.");
			}).catch((err) => {
				console.log("No rooms retrieved from API endpoint.");
			});
	}, []);


	return (
		<div className="home">
			<div className="container header text-center mt-5">
				<h1 className="title">Find Rooms</h1>
				<p className="subtitle">Private rooms are currently not enabled. The feature will be implemented soon.</p>
				<Link to="/create" className="btn button-md" >Create Room</Link>
			</div>
			<div className="container mt-4">
				{// Check if the API data is undefined
					(typeof data.rooms === "undefined") ? (
						<p className="text-center subtitle">No rooms available...</p>
					) : (
						data.rooms.map((room, i) => (
							<Card
								key={i}
								link={`/room/${room.id}`}
								title={room.name}
								subtitles={[room.description]}
								is_private={room.private}
							/>
						))
					)}
			</div>
		</div>
	);
}

export default withRouter(Home);
