login();
//fill();

window.addEventListener('resize', function(event){
  const width = window.innerWidth;
  if(width>1024){
    let sidebar = document.getElementById('left-column')
    let footer = document.getElementById('footer')
    sidebar.style = null;
    footer.style = null;
  }
});

document.getElementById("nav-signup").addEventListener('mouseup', function(){
  unfocusWrapper();
  toggleSignup();
})

document.getElementById("nav-login").addEventListener('mouseup', function(){
  unfocusWrapper();
  toggleLogin();
})

document.getElementById("new-playlist").addEventListener('mouseup', function(){
  unfocusWrapper();
  togglePlaylist();
})

document.addEventListener('mousedown', function handleClickOutsideBox(event) {
  if (!document.getElementById('signup').contains(event.target) && !document.getElementById('signup').classList.contains('hide-floating')) {
    unfocusWrapper();
    toggleSignup();
  }
  if (!document.getElementById('login').contains(event.target) && !document.getElementById('login').classList.contains('hide-floating')) {
    unfocusWrapper();
    toggleLogin();
  }
  if (!document.getElementById('create-playlist').contains(event.target) && !document.getElementById('create-playlist').classList.contains('hide-floating')) {
    unfocusWrapper();
    togglePlaylist();
  }
});

const signupPassword = document.getElementById("signup-password");
signupPassword.addEventListener('keyup', function(){
  if((!/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(signupPassword.value)) || signupPassword.value.length<8){
    if(!signupPassword.classList.contains('sign-error')){
      signupPassword.classList.toggle('sign-error')
    }
  } else {
    if(signupPassword.classList.contains('sign-error')){
      signupPassword.classList.toggle('sign-error')
    }
  }
});
document.getElementById("signup-password").value;

document.getElementById("button-signup").addEventListener('click', function(){
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  const data = {username, password};
  fetch('https://kset.home.asidiras.dev/auth/signup', 
  {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) ,
  }).then((response) => {if(response.status == 201){
    toggleSignup();
    unfocusWrapper();
    setCookie('username', username, 30);
    setCookie('password', password, 30);
  }})
})
document.getElementById("button-login").addEventListener('click', function(){
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  login(username, password);
  toggleLogin();
  unfocusWrapper();
})

function fill(){
  let content = document.getElementById("content");
  fetch('https://kset.home.asidiras.dev/track/?search&index=0&size=999', {method: 'GET'})
  .then((response) => response.json())
  .then((data) => {
    data.sort(function(a, b) {
      let keyA = a.title.toUpperCase();
      let keyB = b.title.toUpperCase();
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    let prevletter = ""
    for(let i=0; i<data.length; i++){
      let letter = isNaN(data[i]["title"][0])? data[i]["title"][0].toUpperCase(): "number"
      if(prevletter != letter){
        prevletter = letter;
        const section = document.createElement('h3');
        section_text = document.createTextNode(`Songs starting with ${letter}`);
        section.appendChild(section_text);
        section.classList.add('text');
        section.classList.add('section');
        content.appendChild(section);
      }
      createTrack(data[i]["cover"], data[i]["path"], data[i]["title"]);
    }
    const spacer = document.createElement('div');
    spacer.classList.add('spacer');
    content.appendChild(spacer);
  })
}

function burger(menu) {
  menu.classList.toggle("change");
  let sidebar = document.getElementById('left-column')
  let footer = document.getElementById('footer')
  if (sidebar.style.display === "block") {
    sidebar.style.display = "none";
    footer.style.display = "flex";
  } else {
    sidebar.style.display = "block";
    footer.style.display = "none";
  }
} 

function createTrack(imgSrc, songSrc, title){
  //create the track element
  const track = document.createElement('div');
  track.classList.add('track');
  // create cover element
  const cover = document.createElement('img');
  cover.setAttribute("id", `${songSrc}|${imgSrc}`);
  cover.setAttribute("loading", "lazy");
  cover.classList.add('cover');
  cover.src = `https://kset.home.asidiras.dev/album/cover/${imgSrc}`;

  const playWrapper = document.createElement('div');
  playWrapper.classList.add('play-wrapper');
  const play = document.createElement('img');
  play.setAttribute("loading", "lazy");
  play.classList.add('play');
  play.src = "assets/play.webp";
  playWrapper.appendChild(play);
  // create the title
  const text = document.createElement('p');
  text.classList.add('title');
  text.textContent = title
  // put cover and title inside track
  track.appendChild(playWrapper);
  track.appendChild(cover);
  track.appendChild(text);
  
  // add event listener to change track
  cover.addEventListener("mousedown", (e)=> {
    let id = (e.target.id);
    const songSrc = id.split('|')[0];
    const imgSrc = id.split('|')[1];
    let source = document.getElementById("source");
    source.src = `https://kset.home.asidiras.dev/stream/download/${songSrc}`;
    let miniCover = document.getElementById("miniCover");
    miniCover.src = `https://kset.home.asidiras.dev/album/cover/${imgSrc}`;
    let audio = document.getElementById("audio");
    audio.load()
    audio.play()
  });
  const content = document.getElementById("content");
  content.appendChild(track);
}

/* searchMusicLibrary()
 * hides elements that do not contain inputed search query
 *
 * Inspiration from https://www.w3schools.com/howto/howto_js_search_menu.asp
 */
function searchMusicLibrary() {
  // Declare variables
  var input, filter, ul, li, a, i;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase();
  ul = document.getElementById("content");
  li = ul.getElementsByClassName("track");

  // Remove heading if there is a search query
  if(filter.length == 0) {
    for (i = 0; i < ul.getElementsByClassName("section").length; i++) {
      ul.getElementsByClassName("section")[i].style.display = "";
    }
  } else {
    for (i = 0; i < ul.getElementsByClassName("section").length; i++) {
      ul.getElementsByClassName("section")[i].style.display = "none";
    }
  }

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function unfocusWrapper(){
  const wrapper = document.getElementById('wrapper');
  wrapper.classList.toggle('unfocus');
}

function toggleSignup(){
  const signup = document.getElementById('signup');
  
  signup.classList.toggle('hide-floating');
  signup.classList.toggle('focus');
}

function toggleLogin(){
  const login = document.getElementById('login');
  login.classList.toggle('hide-floating');
  login.classList.toggle('focus');
}
function togglePlaylist(){
  const playlist  = document.getElementById('create-playlist');
  playlist.classList.toggle('hide-floating');
  playlist.classList.toggle('focus');
}

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    // add other defaults here if necessary
    ...options
  };
  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }
  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function login(username='', password=''){
  const cookieUsername = getCookie('username');
  const cookiePassword = getCookie('password');
  const data = {username: username?username:cookieUsername, password: password?password:cookiePassword};
  console.log(cookieUsername, cookiePassword);
  fetch('https://kset.home.asidiras.dev/auth/signin', 
  {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) ,
  }).then((response) => {if(response.status == 201){
    fill();
    document.getElementById('banner').style = 'display: none';
    setCookie('username', username, {secure: true, 'max-age': 3600*24*30});
    setCookie('password', password, {secure: true, 'max-age': 3600*24*30});
    response.json().then((value)=> {
      setCookie('bearer', 'Bearer '+value.accesToken, {secure: true, 'max-age': 3600*24*7});
    });
  }})}
function switchContent(div) {
  if(div == 'content'){
    document.getElementById('playlist-selection').classList.add('hide-floating');
    document.getElementById('content').classList.remove('hide-floating');
  } else {
    document.getElementById('playlist-selection').classList.remove('hide-floating');
    document.getElementById('content').classList.add('hide-floating');
  }
}