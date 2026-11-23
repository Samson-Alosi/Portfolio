(function () {
  const suggestions = {
    body: {
      label: "For body tension or restlessness",
      text: "Notice your feet on the floor and name a few things you see or hear. Let your breathing happen naturally."
    },
    thoughts: {
      label: "For busy thoughts",
      text: "Gently name what you notice, such as “I’m noticing a worry,” then return attention to one small thing you choose to do."
    },
    demands: {
      label: "For tasks that feel like too much",
      text: "Write down one small next action. You do not have to solve everything at once."
    },
    connection: {
      label: "For feeling disconnected",
      text: "Consider sending someone you trust a simple message asking for a check-in."
    }
  };

  function addSuggestion(list, suggestion) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = `${suggestion.label}: `;
    item.append(title, document.createTextNode(suggestion.text));
    list.appendChild(item);
  }

  document.addEventListener("submit", function (event) {
    const form = event.target;
    if (!form || form.id !== "stress-checkin-form") return;

    event.preventDefault();
    const selected = new FormData(form).getAll("stressSignals");
    const result = document.getElementById("stress-checkin-result");
    if (!result) return;
    result.replaceChildren();

    if (selected.length === 0) {
      result.textContent = "Choose any statement that feels relevant, or skip the check-in and read the optional coping ideas below.";
      result.hidden = false;
      return;
    }

    const heading = document.createElement("h3");
    heading.textContent = "One small step you could try";
    const intro = document.createElement("p");
    intro.textContent = "There is no score or interpretation—these are optional ideas based on what you selected.";
    const list = document.createElement("ul");

    selected.forEach(function (signal) {
      const suggestion = suggestions[signal];
      if (suggestion) addSuggestion(list, suggestion);
    });

    result.append(heading, intro, list);
    result.hidden = false;
  });

  document.addEventListener("reset", function (event) {
    const form = event.target;
    if (!form || form.id !== "stress-checkin-form") return;
    const result = document.getElementById("stress-checkin-result");
    if (!result) return;
    result.hidden = true;
    result.replaceChildren();
  });
})();
