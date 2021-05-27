var txt = document.getElementById("input");
var enter = document.getElementById("enter");
var container = document.getElementById("container");
var cards = document.getElementsByClassName("rec-card");

function recListener() {
  var cards = document.getElementsByClassName("rec-card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function (event) {
      var currElement = event.target;
      //if(currElement.className)
      if (currElement.className != "rec-card") {
        currElement = currElement.parentElement;
      }

      getAnime(currElement.getElementsByClassName("rec-name")[0].innerHTML);
    });
  }
}

function getReccomendation(name) {
  //if reccomendations div  has no children add div (class rec-title) that containes Header that says Reccomended:

  //remove all current reccomendations

  //get reccomendations from api (
  let reccontainer = document.getElementById("reccontainer");
  while (reccontainer.lastChild) {
    reccontainer.removeChild(reccontainer.lastChild);
  }
  //create cards for each Reccomendation and add it to the container of reccomendations

  //temporary fixed example

  /*
  const title = document.createElement("div");
  title.setAttribute("class", "rec-title");
  const titleh1 = document.createElement("h1");
  titleh1.innerHTML = "Reccomended: ";
  title.appendChild(titleh1);

  reccontainer.appendChild(title);
  const card = document.createElement("div");
  card.setAttribute("class", "rec-card");
  const h3e = document.createElement("h3");
  h3e.setAttribute("class", "rec-name");
  h3e.innerHTML = "One Piece";
  const imge = document.createElement("img");
  imge.src =
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21-tXMN3Y20PIL9.jpg";
  card.appendChild(imge);
  card.appendChild(h3e);

  const card2 = document.createElement("div");
  card2.setAttribute("class", "rec-card");
  const h3e2 = document.createElement("h3");
  h3e2.setAttribute("class", "rec-name");
  h3e2.innerHTML = "Bleach";
  const imge2 = document.createElement("img");
  imge2.src =
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx269-KxkqTIuQgJ6v.png";

  card2.appendChild(imge2);
  card2.appendChild(h3e2);

  reccontainer.appendChild(card2);
  reccontainer.appendChild(card);

  */

  var query = `
   query($search: String) {
      Media(search:$search,type:ANIME){
    	recommendations {
        edges {
          node {
            mediaRecommendation {
              title{
                english
                romaji
                native
              }
              coverImage {
                extraLarge
              }
            }
          }
        }
      }
    }  
   }`;

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
    .then((result) => displayReccomedations(result, reccontainer))
    .catch((error) => console.log(error));

  //)

  //add event listener to all the cards
}

function displayReccomedations(result, reccontainer) {
  console.log(result);
  var recs = result.data.Media.recommendations.edges;
  if (result.data == null || recs.length == 0) {
    const title = document.createElement("div");
    title.setAttribute("class", "rec-title");
    const titleh1 = document.createElement("h1");
    titleh1.innerHTML = "Sorry There Were No Reccomendations Found";
    title.appendChild(titleh1);
    reccontainer.appendChild(title);
  } else {
    for (var i = 0; i < recs.length; i++) {
      currRec = recs[i].node.mediaRecommendation;
      var card = document.createElement("div");
      card.setAttribute("class", "rec-card");
      var h3e = document.createElement("h3");
      h3e.setAttribute("class", "rec-name");
      var currtitle = currRec.title.english;
      if (currtitle == null) {
        currtitle = currRec.title.romaji;
      }

      if (currtitle == null) {
        currtitle = currRec.title.native;
      }
      h3e.innerHTML = currtitle;
      var imge = document.createElement("img");
      imge.src = currRec.coverImage.extraLarge;
      card.appendChild(imge);
      card.appendChild(h3e);
      reccontainer.appendChild(card);
    }
  }
  recListener();
}

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
  if (result.data.Media == null || result.data == null) {
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

    txt.value = "";
    removeCurrentCard();
    addCard(title, coverImage, description, clr);

    getReccomendation(title);
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
