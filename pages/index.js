import Head from 'next/head';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Fleet from '../components/fleet';

export default function Home() {
	const [count, setCount] = useState({});
	const { register, handleSubmit } = useForm();
	const onSubmit = (data) => {
		let ships = Number(data.ships);

		function generateMint() {
			let r1 = 0;
			let r2 = 0;
			let r3 = 0;
			let r4 = 0;
			let r5 = 0;

			for (let i = 1; i < ships + 1; i++) {
				let p = Math.random(1) * 100;

				if (p <= 44) {
					r1 = r1 + 1;
				}

				if (p > 44 && p <= 79) {
					r2 = r2 + 1;
				}

				if (p > 79 && p <= 94) {
					r3 = r3 + 1;
				}

				if (p > 94 && p <= 99) {
					r4 = r4 + 1;
				}
				if (p > 99) {
					r5 = r5 + 1;
				}
			}
			setCount({
				R1: r1,
				R2: r2,
				R3: r3,
				R4: r4,
				R5: r5,
			});
		}
		generateMint();
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<Head>
				<title>Welcome to Cryptomines Mints!!</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col justify-center flex-1 px-20 text-center">
				{/* <form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4">
						<label
							className="block mb-2 text-sm font-bold text-gray-700"
							htmlFor="username"
						>
							Numero de Naves
						</label>
						<input
							className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
							id="ships"
							type="text"
							placeholder="Numero de naves"
							{...register('ships')}
						/>
					</div>
					<button
						className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-400"
						onClick={(e) => handleSubmit(e)}
					>
						Enviar
					</button>
				</form>
				<h1 className="mt-8 mb-2 text-2xl text-blue-600">Resultados</h1>
				<div className="text-left ">
					<p>Naves R1: {count.R1}</p>
					<p>Naves R2: {count.R2}</p>
					<p>Naves R3: {count.R3}</p>
					<p>Naves R4: {count.R4}</p>
					<p>Naves R5: {count.R5}</p>
				</div> */}
				<Fleet />
			</main>

			<footer className="flex flex-col items-center justify-center w-full h-24 border-t">
				<div className="flex items-center gap-4">
					<img src="/eternal.png" alt="eternal" className="w-8 h-8" />
					<div className="text-center">
						<h1>
							Si te fue util se aceptan <strong>donativos</strong>
						</h1>
						<p>0x7FCb6aa57b435B2F0492545089F16Bb49844edd1</p>
					</div>
					<img src="/eternal.png" alt="eternal" className="w-8 h-8" />
				</div>
			</footer>
		</div>
	);
}
