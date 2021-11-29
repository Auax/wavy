import React from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import { useState, useEffect } from 'react';

import Card from "./Card";

const Home = () => {
	const endpoint = process.env.REACT_APP_ENDPOINT;
	// Fetch API data
	const [data, setData] = useState([{}]);
	useEffect(() => {
		axios.get(endpoint + "/api/rooms")
			.then((data) => {
				console.log("API endpoint data retrieved.");
				if (data["status"] === 200) {
					setData(data["data"]);
				}
			}).catch((err) => {
				console.error(err.message);
				console.log("No rooms retrieved from API endpoint.");
			});
	}, [endpoint]);


	return (
		<div className="home">
			<div className="container header text-center mt-5">
				<h1 className="title">Find Rooms</h1>
				<p className="subtitle">Get started by creating a room!</p>
				<Link to="/create" className="btn button-md" >Create Room</Link>
			</div>
			<div className="container mt-5">
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
