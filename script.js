const sentences = [
	`When Gregor was already sticking half way out of the bed - the new method was more of a game than an effort, all he had to do was rock back and forth - it occurred to him how simple everything would be if somebody came to help him.`,
	`Two strong people - he had his father and the maid in mind - would have been more than enough; they would only have to push their arms under the dome of his back, peel him away from the bed, bend down with the load and then be patient and careful as he swang over onto the floor, where, hopefully, the little legs would find a use.`,
	`Should he really call for help though, even apart from the fact that all the doors were locked? Despite all the difficulty he was in, he could not suppress a smile at this thought.`,
	`After a while he had already moved so far across that it would have been hard for him to keep his balance if he rocked too hard.`,
	`The time was now ten past seven and he would have to make a final decision very soon.`,
	`Then there was a ring at the door of the flat.`,
	`"That'll be someone from work", he said to himself, and froze very still, although his little legs only became all the more lively as they danced around.`,
	`For a moment everything remained quiet.`,
	`"They're not opening the door", Gregor said to himself, caught in some nonsensical hope.`
];

const ts = () => ( new Date() ).getTime();
const round = ( value, decimals ) => Number(Math.round(value+'e'+decimals)+'e-'+decimals);

const startTime = ts();
let currentTime = startTime;
const progress = [];
const events = [];
const corpus = sentences[ Math.floor( Math.random() * sentences.length ) ];

const contentElement = document.getElementById( 'content' );
const resultElement = document.getElementById( 'result' );

const renderProgress = () => {
	let content = '';

	progress.forEach( function( key ) {
		if ( key.expected ) {
			const style = key.expected === key.actual ? 'right' : 'wrong';
			content += `<span class="${style}">${key.expected}</span>`;
		}
	});

	for( let index=progress.length; index < corpus.length; index++ ) {
		content += corpus[index];
	}

	contentElement.innerHTML = content;
};

const renderResult = ( endTime ) => {
	let content = '';
	const total = progress.length;
	let correct = 0;
	const seconds = ( endTime - startTime - progress[0].delay ) / 1000;

	content += `<div>Congratulations! You finished in ${ round(seconds, 3) } seconds.</div>`;

	progress.forEach( function( key ) {
		if ( key.expected === key.actual) {
			correct += 1;
		}
	} );

	const percent = correct / total * 100;

	content += `<div>You typed ${correct}/${total} correctly (${ round( percent, 3) }%).`;

	const words = total / 5;
	const minutes = seconds / 60;
	const gross = words / minutes;
	const errors = total - correct;
	const net = ( words - errors ) / minutes;

	content += `<div>Your gross wpm was ${ round( gross, 3 ) } and net ${ round( net, 3) }.</div>`;

	resultElement.innerHTML = content;
};

renderProgress();

document.onkeypress = ( event ) => {
	const newTime = ts();
	if (event.key.length === 1) {
		const expected = corpus[progress.length];
		const actual = event.key;
		const delay = newTime - currentTime;

		progress.push({ expected, actual, delay });
		renderProgress();
		currentTime = newTime;
		event.preventDefault();
		if ( progress.length == corpus.length ) {
			renderResult( newTime );
		}
	}
};

document.onkeydown = ( event ) => {
	if (event.code === 'Backspace') {
		progress.splice(-1, 1);
		renderProgress();
		event.preventDefault();
	}
};
