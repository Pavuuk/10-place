import timeout from "./timeout.mjs";
import drawer from "./drawer.mjs";
import picker from "./picker.mjs";

document.querySelector("#start").addEventListener("submit", e => {
  e.preventDefault();
  main(new FormData(e.currentTarget).get("apiKey"));
  document.querySelector(".container").classList.add("ready");
});

const receivedOnField = (message) => {
  const result = JSON.parse(message?.['data'])

  if (result['type'] === 'place')
    drawer.putArray(result['payload']['place']);
}

const main = apiKey => {
  const ws = connect(apiKey);
  ws.addEventListener("message", receivedOnField);

  timeout.next = new Date();
  drawer.onClick = (x, y) => {
    ws.send(JSON.stringify({
      type: "click",
      payload: {x, y, color: picker.color}
    }));
  };
};

const connect = apiKey => {
  const url = `${location.origin.replace(/^http/, "ws")}?apiKey=${apiKey}`;
  return new WebSocket(url);
};
