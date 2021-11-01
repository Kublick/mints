import React from 'react';

export const Card = ({ rarity, mp, color }) => {
	console.log(color);
	return (
		<>
			<div className={`bg-${color}-600 w-24 p-4 rounded-lg`}>
				<h1>{rarity}</h1>
				<p>{mp}</p>
			</div>
		</>
	);
};
