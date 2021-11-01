import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Card } from './card';

const Fleet = () => {
	const [inputShip, setInputShip] = useState(0);
	const [inputWorker, setInputWorker] = useState(0);
	const [fleet, setFleet] = useState([]);
	const [error, setError] = useState('');
	const [price, setPrice] = useState(0);
	const [reward, setReward] = useState(0);

	useEffect(() => {
		fetch(
			'https://api.pancakeswap.info/api/v2/tokens/0xd44fd09d74cd13838f137b590497595d6b3feea4',
		)
			.then((response) => response.json())
			.then((data) => {
				setPrice(Math.round(data.data.price * 100) / 100);
			});

		localStorage.getItem('fleet') &&
			setFleet(JSON.parse(localStorage.getItem('fleet')));
	}, []);

	const handleAddShip = () => {
		let find = fleet.findIndex((ship) => inputShip.id === ship.id);

		if (!inputShip.ship < 0 || inputShip.ship <= 5) {
			let newShip = {
				id: nanoid(),
				name: 'R' + [inputShip.ship],
				slots: inputShip.ship,
				shipMp: 0,
				workers: [],
			};
			let array = [...fleet];
			array[find].totalSlots =
				Number(array[find].totalSlots) + Number(inputShip.ship);
			array[find].ships.push(newShip);
			array[find].fleetRank.push(inputShip.ship);

			function findMostFrequent(array) {
				let obj = {};
				let max = 0;
				let maxNum = 0;
				for (let i = 0; i < array.length; i++) {
					if (obj[array[i]]) {
						obj[array[i]]++;
					} else {
						obj[array[i]] = 1;
					}
				}
				for (let key in obj) {
					if (obj[key] > max) {
						max = obj[key];
						maxNum = key;
					}
				}
				return maxNum;
			}

			const number = findMostFrequent(array[find].fleetRank);

			if (Number(number) === 1) {
				fleet[find].fleetRarity = '⭐';
			}

			if (Number(number) === 2) {
				fleet[find].fleetRarity = '⭐⭐';
			}

			if (Number(number) === 3) {
				fleet[find].fleetRarity = '⭐⭐⭐';
			}

			if (Number(number) === 4) {
				fleet[find].fleetRarity = '⭐⭐⭐⭐';
			}

			if (Number(number) === 5) {
				fleet[find].fleetRarity = '⭐⭐⭐⭐⭐';
			}
			localStorage.setItem('fleet', JSON.stringify(array));
			setFleet(array);
		} else {
			setError('Rareza de la nave no puede ser < 1 o > 5');
			setTimeout(() => {
				setError(null);
			}, 4000);
		}
	};

	const handleAddWorker = () => {
		let findFleet = fleet.findIndex((ship) => inputWorker.idFleet === ship.id);

		let findShip = fleet[findFleet].ships.findIndex(
			(ship) => inputWorker.id === ship.id,
		);

		let workerRarity = '';
		let color = '';
		let workersArray = [...fleet];

		if (inputWorker.value <= 50) {
			workerRarity = 1;
			color = 'gray';
		} else if (inputWorker.value > 50 && inputWorker.value <= 100) {
			workerRarity = 2;
			color = 'green';
		} else if (inputWorker.value > 100 && inputWorker.value <= 150) {
			workerRarity = 3;
			color = 'yellow';
		} else if (inputWorker.value > 150 && inputWorker.value <= 200) {
			workerRarity = 4;
			color = 'red';
		} else if (inputWorker.value > 200 && inputWorker.value <= 255) {
			workerRarity = 5;
			color = 'purple';
		} else if (inputWorker.value > 255) {
			setError('Nivel del worker no puede ser < 1 o > 255');
			setTimeout(() => {
				setError(null);
			}, 4000);
			return;
		}
		let worker = {
			id: nanoid(),
			rarity: 'R' + workerRarity,
			mp: inputWorker.value,
			color: color,
		};
		workersArray[findFleet].ships[findShip].workers.push(worker);
		let shipMp = 0;
		workersArray[findFleet].ships[findShip].workers.map((worker) => {
			shipMp = Number(worker.mp) + shipMp;
		});
		workersArray[findFleet].ships[findShip].shipMp = shipMp;

		let finalMp = 0;

		workersArray[findFleet].ships.map((ship) => {
			finalMp = Number(ship.shipMp) + finalMp;
		});

		workersArray[findFleet].fleetMp = finalMp;
		//workersArray[findFleet].totalSlots = workersArray[findFleet].totalSlots - 1;
		localStorage.setItem('fleet', JSON.stringify(workersArray));
		setFleet(workersArray);
	};

	const handleCreateFleet = () => {
		setFleet([
			...fleet,
			{
				id: nanoid(),
				ships: [],
				fleetRank: [],
				fleetRarity: '',
				totalSlots: 0,
				totalMinePower: 0,
			},
		]);
	};

	const handleRemoveShip = (data) => {
		let findFleet = fleet.findIndex((ship) => data.fleetId === ship.id);
		let findShip = fleet[findFleet].ships.findIndex(
			(ship) => data.shipId === ship.id,
		);
		let array = [...fleet];
		array[findFleet].totalSlots =
			array[findFleet].totalSlots - array[findFleet].ships[findShip].slots;
		array[findFleet].ships.splice(findShip, 1);

		let finalMp = 0;
		array.map(function (item) {
			return item.ships.map(function (item) {
				finalMp = item.shipMp + finalMp;
				return finalMp;
			});
		});
		array[findFleet].fleetMp = finalMp;

		if (array[findFleet].ships.length === 0) {
			array.splice(findFleet, 1);
		}
		localStorage.setItem('fleet', JSON.stringify(array));
		setFleet(array);
	};

	return (
		<div>
			{error ? (
				<p className="px-4 py-2 mb-4 text-xl font-bold text-white bg-red-600 rounded">
					{error}
				</p>
			) : null}
			<div>
				<h1 className="my-4 text-3xl font-bold">
					Cryptomines Fleet Generator!
				</h1>

				<div className="flex flex-col items-end">
					<div className="flex items-center gap-2">
						<img src="/eternal.png" alt="eternal" width={24} height={24} />
						<p className="flex justify-end font-bold text-purple-600">
							Eternal Price: {price}
						</p>
					</div>
					<label htmlFor="">Ingresa el reward del planeta</label>
					<input
						className="w-12 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
						type="text"
						name="reward"
						onChange={(e) =>
							setReward(Math.round(e.target.value * price * 100) / 100)
						}
					/>
					{reward} dlls
				</div>

				<button
					onClick={handleCreateFleet}
					className="px-8 py-2 text-white bg-green-800 rounded-lg "
				>
					Agregar Flota
				</button>
			</div>
			{fleet.map((items, i) => (
				<div
					key={items.id}
					className="p-4 my-2 border-2 border-solid rounded-xl"
				>
					<div key={items.id}>
						<p className="mt-4 text-xl font-bold">Flota {i + 1}</p>
						<div key={items.id} className="flex gap-4">
							<label className="flex items-center">Rareza de la nave</label>
							<input
								className="w-16 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
								id="ships"
								type="text"
								placeholder="nave"
								onChange={(e) =>
									setInputShip({
										id: items.id,
										ship: e.target.value,
									})
								}
								key={items.id}
							/>
							{items.ships.length < 10 ? (
								<button
									onClick={handleAddShip}
									className="px-4 py-2 text-white bg-purple-600"
								>
									+
								</button>
							) : null}
						</div>

						<p className="mt-4 text-center">
							Rango de la flota {items.fleetRarity}
						</p>
					</div>

					{items.ships.map((ship) => (
						<div className="grid items-center grid-cols-3 gap-4 px-6 py-4 mx-4 my-4 bg-blue-100 rounded-lg">
							<div>
								<p className="gap-4 ">Rareza Nave: {ship.name}</p>
								<p>Slots: {ship.slots}</p>
								<p>Mining Power Worker</p>
								<input
									className="w-16 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="Worker"
									type="text"
									placeholder="Nivel Worker"
									onChange={(e) =>
										setInputWorker({
											idFleet: items.id,
											id: ship.id,
											value: e.target.value,
										})
									}
									key={ship.id}
								/>

								{ship.workers.length < ship.slots ? (
									<button
										onClick={handleAddWorker}
										className="px-4 py-2 mx-2 text-white bg-purple-600 rounded"
									>
										+
									</button>
								) : null}
							</div>
							<div className="flex gap-4">
								{ship.workers.map((worker) => (
									<div className="flex flex-col items-center px-4 py-2 rounded-lg">
										<Card
											rarity={worker.rarity}
											mp={worker.mp}
											color={worker.color}
										/>

										{/* <p>Worker</p>
										<p>{worker.rarity}</p>
										<p>{worker.mp}</p> */}
									</div>
								))}
							</div>
							<div className="flex flex-col items-center">
								<p>Mining Power Ship</p>
								<p>{ship.shipMp}</p>
								<button
									className="px-4 py-2 my-2 text-white bg-red-600 rounded"
									onClick={() =>
										handleRemoveShip({ fleetId: items.id, shipId: ship.id })
									}
								>
									Eliminar Nave
								</button>
							</div>
						</div>
					))}
					<div className="flex justify-between gap-4">
						<p className="text-xl font-bold text-red-600">
							Total workers: {items.totalSlots}
						</p>
						<p className="text-xl font-bold text-purple-600">
							Fleet Mining power: {items.fleetMp}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default Fleet;
