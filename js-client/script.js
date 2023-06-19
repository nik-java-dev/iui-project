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

  req.then((res) => res.json()).then((data) => (textBox1.value = data.text));
});

var uploadedImage = "";

uploadForm.addEventListener("change", function (e) {
  // e.preventDefault();

  textBox1.value = "Enter text here...";

  console.log(inputFile.files[0]);
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    uploadedImage = reader.result;

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

  var req = fetch("http://127.0.0.1:5000/generate", {
    method: "post",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ message: textBox1.value }),
  });

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
