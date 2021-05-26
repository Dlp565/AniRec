var txt = document.getElementById("input");
var enter = document.getElementById("enter");
var container = document.getElementById("container");

txt.addEventListener("keydown", function (event) {
  if (event.code == "Enter") {
    var search = txt.value;
    if (search == "") {
      alert("Please enter a valid name!");
    } else {
      getAnime(search);
    }
  }
});

enter.addEventListener("click", function (event) {
  var search = txt.value;
  if (search == "") {
    alert("Please enter a valid name!");
  } else {
    getAnime(search);
  }
});

function getAnime(name) {
  //make api request
  var query = `
   query($search: String) {
      Media(search:$search,type:ANIME){
    	title{
        english
        romaji
        native
      }
    coverImage {
      extraLarge
      color
    }
    description
      
   }
}
   
   `;

  var variables = {
    search: name,
  };

  var url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

  fetch(url, options)
    .then((res) => res.json())
    .then((result) => useResults(result))
    .catch((error) => console.log(error));
}

function useResults(result) {
  if (result.data.Media == null) {
    alert("Anime could not be found");
    txt.value = "";
  } else {
    var title = result.data.Media.title.english;
    if (title == null) {
      title = result.data.Media.title.romaji;
    }
    if (title == null) {
      title = result.data.Media.title.native;
    }
    var coverImage = result.data.Media.coverImage.extraLarge;
    var description = result.data.Media.description;
    var clr = result.data.Media.coverImage.color;
    console.log(title);
    console.log(coverImage);
    console.log(description);

    txt.value = "";
    removeCurrentCard();
    addCard(title, coverImage, description, clr);
  }
}

function removeCurrentCard() {
  if (container.childElementCount != 0) {
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  }
}

function addCard(title, image, desc, clr) {
  const card = document.createElement("div");
  card.setAttribute("class", "card");
  const imga = document.createElement("img");
  imga.src = image;
  card.appendChild(imga);

  const cardInfo = document.createElement("div");
  cardInfo.setAttribute("class", "card-info");
  //h1 and p
  const h1 = document.createElement("h1");
  h1.innerHTML = title;
  const p = document.createElement("p");
  p.innerHTML = desc;
  cardInfo.appendChild(h1);
  cardInfo.appendChild(p);
  card.appendChild(cardInfo);

  container.appendChild(card);

  document.body.style.backgroundColor = clr;
}
