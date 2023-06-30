const uploadForm = document.getElementById("uploadForm");
const inputFile = document.getElementById("inputFile");

const textBox1 = document.getElementById("texBox1");

uploadForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData();

  formData.append("inputFile", inputFile.files[0]);

  console.log("sending to server.....");

  var req = fetch("http://127.0.0.1:5000/upload", {
    method: "post",
    body: formData,
  });

  req
    .then((res) => res.json())
    .then(
      (data) => (
        (textBox1.value = data.text),
        console.log(data),
        window.localStorage.setItem("imageInformation", JSON.stringify(data))
      )
    );
});

var uploadedImage = "";

uploadForm.addEventListener("change", function (e) {
  // e.preventDefault();

  textBox1.value = "Enter text here...";

  console.log(inputFile.files[0]);
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    uploadedImage = reader.result;

    window.localStorage.setItem("originalImage", uploadedImage);
    console.log(uploadedImage);

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    var image = new Image();

    image.onload = function () {
      const width = 300;
      const scaleFactor = width / image.width;
      canvas.width = width;
      canvas.height = image.height * scaleFactor;
      context.drawImage(image, 0, 0, width, image.height * scaleFactor);
      document.getElementById(
        "uploadedImage"
      ).style.backgroundImage = `url(${canvas.toDataURL("image/jpeg")})`;
    };

    image.src = uploadedImage;
  });

  reader.readAsDataURL(inputFile.files[0]);
});

var generatedPhoto;
const transferButton = document.getElementById("transferButton");

transferButton.addEventListener("click", function () {
  var data = new FormData();

  data.append("message", textBox1.value);

  const chooseBackgroundButton = document.getElementById("chooseBackground");
  console.log(chooseBackgroundButton.value);

  var req = fetch(
    "http://127.0.0.1:5000/generate/" + chooseBackgroundButton.value.toString(),
    {
      method: "post",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ message: textBox1.value }),
    }
  );

  req
    .then((responce) => responce.blob())
    .then((blob) => {
      console.log(blob);
      const imageUrl = URL.createObjectURL(blob);
      console.log(imageUrl);

      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");

      var image = new Image();

      image.onload = function () {
        const width = 300;
        const scaleFactor = width / image.width;
        canvas.width = width;
        canvas.height = image.height * scaleFactor;
        context.drawImage(image, 0, 0, width, image.height * scaleFactor);
        document.getElementById(
          "generatedImage"
        ).style.backgroundImage = `url(${canvas.toDataURL("image/jpeg")})`;
      };

      generatedPhoto = imageUrl;
      image.src = imageUrl;
    });
});

const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", () => {
  let imagePath =
    document.getElementById("generatedImage").style.backgroundImage;

  console.log(imagePath);
  url = imagePath.substring(5, imagePath.length - 2);

  let req = fetch(url);

  req
    .then((responce) => responce.blob())
    .then((blob) => {
      console.log(blob);
      const file = new File([blob], "image", { type: blob.type });
      console.log(file);
      saveAs(generatedPhoto, "generated_photo");
    });
});

// ************************ SPELLCHEKING
const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientX);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

function getDragAfterElement(container, x) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.right - box.width / 2;
      console.log(offset);

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// ------------------------------------------------------
draggables.forEach((draggable) => {
  draggable.addEventListener("click", () => {
    var temp = draggable.dataset.tooltip;
    draggable.dataset.tooltip = draggable.innerText;
    draggable.innerText = temp;
  });
});

const btn = document.getElementById("spellcheckButton");

btn.addEventListener("click", () => {
  containers.forEach((container) => {
    let imageInformation = JSON.parse(localStorage.getItem("imageInformation"));
    console.log(imageInformation);

    const textWords = imageInformation.text.split(" ");
    const suggestedWords = imageInformation.suggested;

    for (var i = 0; i < textWords.length; i++) {
      const newP = document.createElement("p");
      newP.classList.add("draggable");

      newP.draggable = true;

      newP.setAttribute("data-tooltip", suggestedWords[i][0]);

      var text = document.createTextNode(textWords[i]);
      newP.appendChild(text);

      newP.addEventListener("click", () => {
        var temp = newP.dataset.tooltip;
        newP.dataset.tooltip = newP.innerText;
        newP.innerText = temp;
      });

      newP.addEventListener("dragstart", () => {
        newP.classList.add("dragging");
      });

      newP.addEventListener("dragend", () => {
        newP.classList.remove("dragging");
      });

      container.appendChild(newP);
    }
  });
});

const applyButton = document.getElementById("applyButton");

applyButton.addEventListener("click", () => {
  const words = document.querySelectorAll(".draggable");

  var arrayOfWords = new Array();

  words.forEach((word) => {
    arrayOfWords.push(word.innerText);
  });

  textBox1.value = arrayOfWords.join(" ");
});

// ************************ SPELLCHEKING

// ************************ PREVIEW
const previewButton = document.getElementById("previewButton");

previewButton.addEventListener("click", () => {
  window.open("preview.html");
});

window.localStorage.setItem("dict", JSON.stringify(dict));

// ************************ PREVIEW
