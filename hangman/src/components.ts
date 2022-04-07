import { GameStatus, isGameEnded, generateGameMessage } from "./util";
import { calculateImageSize, fetchedImageData } from "./image-util";
import { h, id } from "./dom";
import { State } from "./state";

export const HangmanImage = (
  chancesLeft: number,
  images: fetchedImageData[]
) => {
  const container = <HTMLCanvasElement>id("hangman-image");
  const context = container.getContext("2d");
  context.clearRect(0, 0, container.width, container.height);

  images.slice(chancesLeft).map((item) => {
    const calculatedSize = calculateImageSize(
      item.image.width,
      item.image.height,
      70
    );

    context.drawImage(
      item.image,
      item.dx,
      item.dy,
      calculatedSize[0],
      calculatedSize[1]
    );
  });
};

export const Word = ({ gameStatus, chancesLeft, wordArr }: Partial<State>) => {
  const container = id("word");
  container.innerHTML = "";

  if (isGameEnded(gameStatus)) {
    const message = h("p");
    message.innerText = generateGameMessage(gameStatus, chancesLeft);
    container.appendChild(message);
    return;
  }

  const wordText = h("div");
  wordText.classList.add("word-text");

  const spans = wordArr.map((c) => {
    const span = h("span");

    if (c !== " ") {
      span.classList.add("character");
    }

    span.innerText = c;
    return span;
  });

  wordText.append(...spans);
  container.appendChild(wordText);
};

export const KeyboardLayout = (
  gameStatus: string,
  enteredCharacters: { [key: string]: boolean },
  onClickItem: Function
) => {
  const container = id("keyboard-layout");
  container.innerHTML = "";

  const ul = h("ul");
  ul.classList.add("keyboard-layout");

  "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .map((c) => {
      const li = <HTMLLIElement>h("li");
      const button = <HTMLButtonElement>h("button");

      button.addEventListener("click", () => onClickItem(c));
      button.classList.add("keyboard-button");
      button.innerText = c;
      button.disabled = isGameEnded(gameStatus) || enteredCharacters[c];

      li.appendChild(button);
      return li;
    })
    .forEach((node) => ul.appendChild(node));

  container.appendChild(ul);
};

export const ButtonBox = (
  { wordLoading, gameStatus, chancesLeft, timer }: State,
  onClickStart: () => void
) => {
  const container = id("button-box");
  container.innerHTML = "";

  // chances text
  const chances = h("div");
  chances.classList.add("chances-text");
  chances.innerText = `Chances: ${chancesLeft}`;

  // timer
  const timerText = h("div");
  timerText.classList.add("timer-text");
  timerText.innerText = timer.toString();

  // Game start button
  const button = <HTMLButtonElement>h("button");
  button.classList.add("start-button");
  button.innerText = "START";
  button.disabled = wordLoading || !isGameEnded(gameStatus);
  button.addEventListener("click", onClickStart);

  container.append(chances, timerText, button);
};

export function render(
  state: State,
  onClickItem: Function,
  onClickStart: () => void,
  imageSources: fetchedImageData[]
) {
  KeyboardLayout(state.gameStatus, state.enteredCharacters, onClickItem);
  Word(state);
  ButtonBox(state, onClickStart);
  HangmanImage(state.chancesLeft, imageSources);
}
