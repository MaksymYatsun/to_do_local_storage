document.addEventListener("DOMContentLoaded", () => {
  addToDo("to-do");
  initThemeChange();

  particlesJS.load("particles-js", "./lib/particles.json", function () { });

  function initThemeChange() {
    const moonPath =
      "M16 28C16 43.1878 28 55.5 28 55.5C12.8122 55.5 0.5 43.1878 0.5 28C0.5 12.8122 12.8122 0.5 28 0.5C28 0.5 16 12.8122 16 28Z";
    const sunPath =
      "M55 27.5C55 42.6878 42.6878 55 27.5 55C12.3122 55 0 42.6878 0 27.5C0 12.3122 12.3122 0 27.5 0C42.6878 0 55 12.3122 55 27.5Z";
    const darkMode = document.querySelector("#darkMode");

    let toggle;

    if (!localStorage.getItem("darkTheme")) {
      toggle = true;
      localStorage.setItem("darkTheme", "true");
    }

    if (localStorage.getItem("darkTheme")) {
      if (localStorage.getItem("darkTheme") === "true") {
        toggle = true;
      }

      if (localStorage.getItem("darkTheme") === "false") {
        toggle = false;
        localStorage.setItem("darkTheme", "false");
      }
    }

    changeTheme();

    darkMode.addEventListener("click", () => {
      localStorage.setItem("darkTheme", `${!toggle}`);
      toggle = !toggle;
      changeTheme();
    });

    function changeTheme() {
      const timeline = anime.timeline({
        duration: 750,
        easing: "easeOutExpo",
      });

      timeline
        .add(
          {
            targets: "body",
            color: toggle ? "#cbd5e1" : "#020617",
            background: toggle ? "#1e293b" : "#94a3b8",
          },
          "-=550"
        )
        .add(
          {
            targets: ".card",
            background: toggle ? "#1e293b" : "#94a3b8",
          },
          "-=550"
        )
        .add(
          {
            targets: ".moon",
            d: [{ value: toggle ? moonPath : sunPath }],
          },
          "-=350"
        );
    }
  }

  function addToDo(toDoId) {
    const toDo = document.getElementById(toDoId);
    const itemsArray = localStorage.getItem("items")
      ? JSON.parse(localStorage.getItem("items"))
      : [];

    toDo.querySelector("#enter").addEventListener("click", () => {
      const item = toDo.querySelector("#new-card");
      const date = new Date().toString().split(" ");
      const dateString = `Date: ${date[1]} ${date[2]} ${date[3]} \n Time: ${date[4]}`;

      createItem(item, dateString);
    });

    function displayItems() {
      const items = toDo.querySelector("#to-do-list");
      for (let i = 0; i < itemsArray.length; i++) {
        const listItem = document.createElement("div");
        listItem.classList.add(
          "card",
          "border",
          "relative",
          "rounded-xl",
          "p-2",
          "bg-opacity-90",
          `${localStorage.getItem("darkTheme") === "true"
            ? "bg-[#1e293b]"
            : "bg-[#94a3b8]"
          }`,
          "transition-all",
          "hover:shadow-2xl",
          "hover:shadow-red-500",
          "focus-within:shadow-2xl",
          "focus-within:shadow-red-600"
        );
        items.appendChild(listItem);

        const cardHeader = document.createElement("div");
        cardHeader.classList.add(
          "w-full",
          "flex",
          "justify-between",
          "text-xl",
          "font-semibold"
        );
        listItem.appendChild(cardHeader);

        const createdDate = document.createElement("span");
        cardHeader.classList.add("inline-block");
        cardHeader.innerText = JSON.parse(itemsArray[i]).date;
        cardHeader.appendChild(createdDate);

        const editItem = document.createElement("div");
        editItem.classList.add("px-2", "flex", "my-auto");
        cardHeader.appendChild(editItem);

        const deleteBtn = document.createElement("i");
        deleteBtn.tabIndex = 0;
        deleteBtn.classList.add("mr-3");
        deleteBtn.dataset.btn = "delete";
        deleteBtn.classList.add(
          "fa-solid",
          "fa-check",
          "transition-all",
          "hover:scale-110",
          "focus:scale-110",
          "outline-none"
        );
        editItem.appendChild(deleteBtn);

        const editBtn = document.createElement("i");
        editBtn.dataset.btn = "edit";
        editBtn.tabIndex = 0;
        editBtn.classList.add(
          "fa-solid",
          "fa-pen-to-square",
          "transition-all",
          "hover:scale-110",
          "focus:scale-110",
          "outline-none"
        );
        editItem.appendChild(editBtn);

        const text = document.createElement("textarea");
        text.classList.add(
          "resize-none",
          "bg-transparent",
          "w-full",
          "mb-3",
          "h-[200px]",
          "scrollbar-thin",
          "scrollbar-thumb-slate-600",
          "w-[80%]",
          "outline-none"
        );
        text.disabled = true;
        text.innerText = JSON.parse(itemsArray[i]).value;
        listItem.appendChild(text);

        const updateItem = document.createElement("div");
        updateItem.classList.add("hidden", "updateItem");
        listItem.appendChild(updateItem);

        const saveBtn = document.createElement("button");
        saveBtn.classList.add(
          "font-bold",
          "mr-3",
          "py-1",
          "px-3",
          "transition-all",
          "hover:scale-110",
          "focus:scale-110",
          "outline-none"
        );
        saveBtn.dataset.btn = "save";
        saveBtn.innerText = "Save";
        updateItem.appendChild(saveBtn);

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add(
          "font-bold",
          "py-1",
          "px-3",
          "transition-all",
          "hover:scale-110",
          "focus:scale-110",
          "outline-none"
        );
        cancelBtn.dataset.btn = "cancel";
        cancelBtn.innerText = "Cancel";
        updateItem.appendChild(cancelBtn);
      }

      activateDeleteListeners();
      activateEditListeners();
      activateSaveListeners();
      activateCancelListeners();
    }

    function activateDeleteListeners() {
      const deleteBtn = document.querySelectorAll('[data-btn="delete"]');
      deleteBtn.forEach((db, i) => {
        db.addEventListener("click", () => {
          deleteItem(i);
        });

        db.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            deleteItem(i);
          }
        });
      });
    }

    function activateEditListeners() {
      const editBtn = toDo.querySelectorAll('[data-btn="edit"]');
      const updateItem = toDo.querySelectorAll(".updateItem");
      const inputs = toDo.querySelectorAll("textarea");
      editBtn.forEach((eb, i) => {
        eb.addEventListener("click", () => {
          updateItem[i].classList.remove("hidden");
          inputs[i].disabled = false;
        });

        eb.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            updateItem[i].classList.remove("hidden");
            inputs[i].disabled = false;
          }
        });
      });
    }

    function activateSaveListeners() {
      const saveBtn = toDo.querySelectorAll('[data-btn="save"]');
      const inputs = toDo.querySelectorAll("textarea");

      saveBtn.forEach((sb, i) => {
        sb.addEventListener("click", () => {
          updateItem(inputs[i].value, i);
          location.reload();
        });
      });
    }

    function activateCancelListeners() {
      const cancelBtn = document.querySelectorAll('[data-btn="cancel"]');
      const updateItem = document.querySelectorAll(".updateItem");
      const inputs = document.querySelectorAll("#text");

      cancelBtn.forEach((cb, i) => {
        cb.addEventListener("click", () => {
          updateItem[i].classList.add("hidden");
          inputs[i].disabled = true;
          location.reload();
        });
      });
    }

    function updateItem(text, i) {
      itemsArray[i] = text;
      localStorage.setItem("items", JSON.stringify(itemsArray));
      location.reload;
    }

    function deleteItem(i) {
      itemsArray.splice(i, 1);
      localStorage.setItem("items", JSON.stringify(itemsArray));
      location.reload();
    }

    function createItem(item, date) {
      itemsArray.push(JSON.stringify({ value: item.value, date: date }));
      localStorage.setItem("items", JSON.stringify(itemsArray));
      location.reload();
    }

    function displayDate() {
      let date = new Date();
      date = date.toString().split(" ");
      document.querySelector(
        "#date"
      ).innerHTML = `${date[1]} ${date[2]} ${date[3]}`;
    }

    window.onload = function () {
      displayDate();
      displayItems();
    };
  }
});
