const card = document.querySelector(".card");
const start = document.querySelectorAll(".start");
let opt, timer;
const min = document.querySelector(".min");
const sec = document.querySelector(".sec");

const timerDisplay = function () {
	let valueMin = 0,
		valueSec = 0;

	const tick = function () {
		valueSec++;

		if (valueSec !== 60)
			sec.textContent = String(valueSec % 60).padStart(2, "0");

		if (valueSec % 60 === 0) {
			valueMin++;
			min.textContent = String(valueMin).padStart(2, "0");
			sec.textContent = String(0).padStart(2, "0");
		}

		if (valueMin % 60 === 0) {
			min.textContent = String(0).padStart(2, "0");
			sec.textContent = String(0).padStart(2, "0");
		}
	};
	tick();
	timer = setInterval(tick, 1000);
};

const startQuiz = async function () {
	let url;
	if (opt === 1) {
		url = "../../currentaffairs.json";
		type = "Current Affairs";
	}
	if (opt === 2) {
		url = "../../nature.json";
		type = "Nature";
	}

	const questions = await fetch(url);

	const output = await questions.json();
	let n = 1,
		score = 0,
		realAns;

	card.innerHTML = `
		<div class="card-header question-val fs-5">Question ${n} of 20</div>
		<div class="card-body">
			<h5 class="card-title question-text">${output[n][0]}</h5>
			<form class="pt-4">
				<input
					type="text"
					class="form-control answer"
					id="ans"
					placeholder="Answer"
				/>
			</form>
			<div class="d-flex pt-4">
				<div class="me-auto mt-2" style="font-size: 14px;">${type}</div>
				<div class="ms-auto">
					<button class="btn btn-primary stop">Stop</button>
					<button class="btn btn-primary next">Next</button>
				</div>
			</div>
		</div>`;
	const questionVal = card.querySelector(".question-val");
	const questionText = card.querySelector(".question-text");
	const ans = card.querySelector(".answer");
	let next = document.querySelector(".next");
	let stop = document.querySelector(".stop");

	timerDisplay();
	if (String(ans.value).toLowerCase() === String(output[n][1]).toLowerCase())
		score++;

	const nextQuestion = async function () {
		try {
			if (
				String(ans.value).toLowerCase() === String(output[n][1]).toLowerCase()
			)
				score++;
			ans.value = "";

			n++;
			if (n <= 20) {
				questionVal.innerHTML = "Question " + `${n}` + " of 20";
				questionText.innerHTML = `${output[n][0]}`;
			}

			if (n === 20) {
				next.textContent = "Finish";
				stop.style.display = "none";
			}

			if (n > 20) {
				let timeUsed = document.querySelector(".timer").textContent;
				clearInterval(timer);
				min.textContent = sec.textContent = String(0).padStart(2, "0");

				card.innerHTML = `
					<div class="card-header question-val fs-5">You are done!</div>
					<div class="card-body">				
						<h4 class="text-success">Total Score</h4>
						<h5 class="score">${score}</h5>
						<h4 class="text-success">Time Used</h4>
						<h5 class="score">${timeUsed}</h5>
						<div class="d-flex pt-4">
							<div class="ms-auto">
								<button class="btn btn-primary go-home">Go Home</button>
							</div>
						</div>
					</div>`;

				const goHome = document.querySelector(".go-home");
				goHome.addEventListener("click", () => {
					document.location.reload();
				});
			}
		} catch (err) {
			console.error(`${err}`);
		}
	};

	next.addEventListener("click", nextQuestion);
	stop.addEventListener("click", () => {
		document.location.reload();
	});
};

for (let i = 0; i < start.length; i++) {
	start[i].addEventListener("click", function () {
		if (
			start[i].parentElement.parentElement.classList.contains("type-1") === true
		)
			opt = 1;
		if (
			start[i].parentElement.parentElement.classList.contains("type-2") === true
		)
			opt = 2;
		startQuiz();
	});
}
