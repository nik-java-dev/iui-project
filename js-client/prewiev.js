window.onload = (event) => {
  let imageInformation = JSON.parse(localStorage.getItem("imageInformation"));
  console.log(imageInformation);

  const image = document.getElementById("image");
  image.src = window.localStorage.getItem("originalImage");
  image.style.position = "absolute";
  image.style.top = "0px";
  image.style.left = "0px";
  image.style.height = imageInformation.imageHeight.toString() + "px";
  image.style.width = imageInformation.imageWidth.toString() + "px";

  const closeButton = document.getElementById("closeButton");
  closeButton.addEventListener("click", () => {
    window.close();
  });

  const wordBoxes = imageInformation.wordBoxes;
  const mainContainer = document.getElementById("mainContainer");

  const suggestedWords = imageInformation.suggested;
  console.log(suggestedWords);

  for (var i = 0; i < wordBoxes.length; i++) {
    const newDiv = document.createElement("div");

    newDiv.classList.add("marker");
    newDiv.style.position = "absolute";

    newDiv.style.top = wordBoxes[i][1].toString() + "px";
    newDiv.style.left = wordBoxes[i][0].toString() + "px";

    newDiv.style.height = (wordBoxes[i][3] - wordBoxes[i][1]).toString() + "px";
    newDiv.style.width = (wordBoxes[i][2] - wordBoxes[i][0]).toString() + "px";

    newDiv.setAttribute("data-tooltip", i.toString());

    newDiv.addEventListener("mouseover", (e) => {
      document.getElementById("suggestedText").innerText =
        suggestedWords[parseInt(newDiv.getAttribute("data-tooltip"))].join("→");
    });

    newDiv.addEventListener("mouseout", (e) => {
      document.getElementById("suggestedText").innerText = "";
    });

    mainContainer.appendChild(newDiv);
  }
};
