import "./app.css";
import {
  initializeState,
  initialState,
  startGame,
  decreaseTimer,
  selectCharacter,
  checkGameStatus,
  setWordLoading,
  State,
} from "./state";
import { render } from "./components";
import { GameStatus, fetchWord, isGameEnded } from "./util";
import { fetchAllImages, fetchedImageData } from "./image-util";

const App = () => {
  let state: State = { ...initialState };
  let imageSources: fetchedImageData[] = null;

  function changeState(callback: Function) {
    state = callback(state);
    render(state, onClickItem, onClickStart, imageSources);
  }

  async function initializeData() {
    const images = await fetchAllImages();
    imageSources = images;
  }

  function onClickItem(c: string) {
    changeState((state: State) => selectCharacter(state, c));
  }

  function onClickStart() {
    if (state.wordLoading) return;

    changeState((state: State) => setWordLoading(state, true));

    fetchWord().then((word) => {
      const intervalId = setInterval(() => {
        if (isGameEnded(state.gameStatus)) {
          clearInterval(intervalId);
          return;
        }

        changeState((state: State) => checkGameStatus(decreaseTimer(state)));
      }, 1000);

      changeState((state: State) =>
        startGame(initializeState(setWordLoading(state, false), word))
      );
    });
  }

  initializeData().then(() =>
    render(state, onClickItem, onClickStart, imageSources)
  );
};

export default App;
