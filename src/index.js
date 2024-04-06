import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1, table, tbody, th, td, tr, input, label, textarea } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition-colors ring-offset-1 focus:ring-green-700";
const btnStyle2 = "bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors ring-offset-1 focus:ring-red-700";
const cardStyle = "bg-pink-300 p-3 m-3";

// Messages which can be used to update the model
const MSGS = {
  CARDS: "CARDS",
  ADD: "ADD",
  DELETE: "DELETE",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    label({ className: "text-gray-700 text-sm font-bold mb-2" }, "cards"),
    input({
      id: "cards",
      className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700",
    }),
    button({
      className: btnStyle,
      onclick: () => dispatch({ type: MSGS.ADD, payload: { cards: document.getElementById("cards").value } })
    }, "ADD"),
    div({ className: "" }, [ //model.cItem.map(item) =>
      label({ className: "text-gray-700 text-sm font-bold mb-2" }, "Card Name"),
      //div [({ className: ""}, model.cards)],
      textarea({ className: "" }, "item.answer.toString"),
    ]),
    button({
      className: btnStyle2,
      onclick: () =>
        dispatch({ type: MSGS.DELETE, payload: item.id }),
    },
      "Delete"),
    div({ className: "" }, displayCards(model.cards, dispatch)),
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  console.log("msg: ", msg);
  console.log("model: ", model);
  switch (msg.type) {
    case MSGS.CARDS:
      return { ...model, tempCards: { ...model.tempCards, temp: msg.cards } };
    case MSGS.ADD:
      const messagePayload = msg.payload.cards;
      console.log(messagePayload);
      return { ...model, cards: updateCards };

    case MSGS.DELETE:
      const idDel = msg.payload;
      const filteredItems = model.cards.filter((card) => card.id !== idDel);
      return { ...model, cards: filteredItems };
    default:
      return model;
  }
}

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The initial model when the app starts
const initModel = {
  cards: [
    {
      id: 1,
      question: "Blood for the Bloodgod",
      answer: "Milk for the Khorne flakes!"
    },
    {
      id: 2,
      question: "Blood for the <sdgBloodgod",
      answer: "Milk for the Khorne flakes!"
    },
    {
      id: 3,
      question: "Blood for the sdhsdhbsdhBloodgod",
      answer: "Milk for the Khorne flakes!"
    }
  ],
  tempCards: {
    id: 0,
    question: "",
    answer: ""
  }
};

/* function essen(mahlzeit) {
  console.log(mahlzeit);
  count();
}
let counter = 0;
function count() {
  counter++
  console.log(counter);
} */



function displayCards(cards, dispatch) {
  console.log(cards);
  /*  essen("Spaghetti");
   essen("Spaghetti");
   essen("Spaghetti"); */
  console.log(cards[1].question);
  const maped = cards.map(card => {
    console.log(card.question);
    return div({ className: cardStyle }, [card.question, button({
      className: btnStyle2,
      onclick: () =>
        dispatch({ type: MSGS.DELETE, payload: card.id }),
    },
      "Delete")]);
  })
  console.log(maped);
  return maped;
}

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
