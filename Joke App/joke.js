async function GetNewJoke() {
  const API_URL = "https://v2.jokeapi.dev/joke/Dark,Spooky?blacklistFlags=political,racist";

  const response = await fetch(API_URL);

  const data = await response.json();

  if(data.type === "single")
  {
    document.getElementById("setup").innerText = data.joke;
    document.getElementById("delivery").innerText = "";
  }
  else
    {
    document.getElementById("setup").innerText = data.setup;
    document.getElementById("delivery").innerText = data.delivery;
  }
}
