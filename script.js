const sentences = [
  `When Gregor was already sticking half way out of the bed - the new method was more of a game than an effort, all he had to do was rock back and forth - it occurred to him how simple everything would be if somebody came to help him.`,
  `Two strong people - he had his father and the maid in mind - would have been more than enough; they would only have to push their arms under the dome of his back, peel him away from the bed, bend down with the load and then be patient and careful as he swang over onto the floor, where, hopefully, the little legs would find a use.`,
  `Should he really call for help though, even apart from the fact that all the doors were locked? Despite all the difficulty he was in, he could not suppress a smile at this thought.`,
  `After a while he had already moved so far across that it would have been hard for him to keep his balance if he rocked too hard.`,
  `The time was now ten past seven and he would have to make a final decision very soon.`,
  `Then there was a ring at the door of the flat.`,
  `"That'll be someone from work", he said to himself, and froze very still, although his little legs only became all the more lively as they danced around.`,
  `For a moment everything remained quiet.`,
  `"They're not opening the door", Gregor said to himself, caught in some nonsensical hope.`,
  `Someone must have been telling lies about Josef K., he knew he had done nothing wrong but, one morning, he was arrested.`,
  `Every day at eight in the morning he was brought his breakfast by Mrs. Grubach's cook - Mrs. Grubach was his landlady - but today she didn't come.`,
  `That had never happened before.`,
  `K. waited a little while, looked from his pillow at the old woman who lived opposite and who was watching him with an inquisitiveness quite unusual for her, and finally, both hungry and disconcerted, rang the bell.`,
  `There was immediately a knock at the door and a man entered.`,
  `He had never seen the man in this house before.`,
  `He was slim but firmly built, his clothes were black and close-fitting, with many folds and pockets, buckles and buttons and a belt, all of which gave the impression of being very practical but without making it very clear what they were actually for.`,
  `"Who are you?" asked K., sitting half upright in his bed.`,
  `The man, however, ignored the question as if his arrival simply had to be accepted, and merely replied, "You rang?"`,
  `"Anna should have brought me my breakfast," said K.`,
  `He tried to work out who the man actually was, first in silence, just through observation and by thinking about it, but the man didn't stay still to be looked at for very long.`,
  `Instead he went over to the door, opened it slightly, and said to someone who was clearly standing immediately behind it, "He wants Anna to bring him his breakfast."`,
  `There was a little laughter in the neighbouring room, it was not clear from the sound of it whether there were several people laughing.`,
  `The strange man could not have learned anything from it that he hadn't known already, but now he said to K., as if making his report "It is not possible."`,
  `"It would be the first time that's happened," said K., as he jumped out of bed and quickly pulled on his trousers.`,
  `"I want to see who that is in the next room, and why it is that Mrs. Grubach has let me be disturbed in this way."`,
  `It immediately occurred to him that he needn't have said this out loud, and that he must to some extent have acknowledged their authority by doing so, but that didn't seem important to him at the time.`,
  `That, at least, is how the stranger took it, as he said, "Don't you think you'd better stay where you are?"`,
  `"I want neither to stay here nor to be spoken to by you until you've introduced yourself."`,
  `"I meant it for your own good," said the stranger and opened the door, this time without being asked.`,
  `The next room, which K. entered more slowly than he had intended, looked at first glance exactly the same as it had the previous evening.`,
  `It was Mrs. Grubach's living room, over-filled with furniture, tablecloths, porcelain and photographs.`,
  `Perhaps there was a little more space in there than usual today, but if so it was not immediately obvious, especially as the main difference was the presence of a man sitting by the open window with a book from which he now looked up.`,
  `"You should have stayed in your room! Didn't Franz tell you?"`,
  `"And what is it you want, then?" said K., looking back and forth between this new acquaintance and the one named Franz, who had remained in the doorway.`,
  `Through the open window he noticed the old woman again, who had come close to the window opposite so that she could continue to see everything.`,
  `She was showing an inquisitiveness that really made it seem like she was going senile.`
];

const ts = () => (new Date()).getTime();
const round = (value, decimals) => Number(Math.round(value+'e'+decimals)+'e-'+decimals);

const startTime = ts();
let currentTime = startTime;
const progress = [];
const events = [];
const length = 5;
const corpus = Array.from(Array(length).keys()).map(() => sentences[Math.floor(Math.random() * sentences.length)]).join(" ");

const contentElement = document.getElementById( 'content' );
const resultElement = document.getElementById( 'result' );

const renderProgress = () => {
  let content = '';

  progress.forEach(key => {
    if (key.expected) {
      const style = key.expected === key.actual ? "right" : "wrong";
      content += `<span class="${style}">${key.expected}</span>`;
    }
  });

  for(let index = progress.length; index < corpus.length; index++) {
    const char = index == progress.length ? `<span class='active'>${corpus[index]}</span>` : corpus[index];
    content += char;
  }

  contentElement.innerHTML = content;
};

const renderResult = (endTime) => {
  let content = '';
  const total = progress.length;
  let correct = 0;
  const seconds = (endTime - startTime - progress[0].delay) / 1000;

  content += `<div>Congratulations! You finished in ${ round(seconds, 3) } seconds.</div>`;

  progress.forEach(key => {
    if ( key.expected === key.actual) {
      correct += 1;
    }
  });

  const percent = correct / total * 100;

  content += `<div>You typed ${correct} out of ${total} characters correctly (${ round( percent, 3) }%).`;

  const words = total / 5;
  const minutes = seconds / 60;
  const gross = words / minutes;
  const errors = total - correct;
  const net = (words - errors) / minutes;

  content += `<div>Your gross wpm was ${round(gross, 3)} and net ${round(net, 3)}.</div>`;

  resultElement.innerHTML = content;
};

renderProgress();

document.onkeypress = event => {
  const newTime = ts();
  if (event.key.length === 1) {
    const expected = corpus[progress.length];
    const actual = event.key;
    const delay = newTime - currentTime;

    progress.push({expected, actual, delay});
    renderProgress();
    currentTime = newTime;
    event.preventDefault();
    if (progress.length == corpus.length) {
      renderResult( newTime );
    }
  }
};

document.onkeydown = event => {
  if (event.code === 'Backspace') {
    progress.splice(-1, 1);
    renderProgress();
    event.preventDefault();
  }
};
