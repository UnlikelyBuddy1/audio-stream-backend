login();  // Check for cookies and sign in if they exist
fill();   // Load content from Back-end

var playlistSongs=[];
var bearer='';
var artists=[];
var likedSongs=[];

// Event Listeners ----------------------------------------------------------------------------------------
window.addEventListener('resize', function(event){  // Resize Window
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

document.getElementById("profile-options").addEventListener('mouseup', function() {
  document.getElementById("profile-menu").classList.toggle('hide-floating');
})
document.getElementById("account-button").addEventListener('mouseup', function() {
  switchContent("account");
  displayAccountInformation();
})
document.getElementById("profile-button").addEventListener('mouseup', function() {
  switchContent("profile");
  displayProfileInformation();
})
document.getElementById("logout-button").addEventListener('mouseup', function() {
  unfocusWrapper();
  toggleLogOut();
  // switchContent("logout-button");
})
document.getElementById("confirm-logout").addEventListener('mouseup', function() {
  deleteAllCookies();
  document.location.reload(true);
})
document.getElementById("cancel-search").addEventListener('mouseup', function() {
  setTimeout(function() {
    searchMusicLibrary();
  }, 1)
  
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
  if (!document.getElementById("logout-window").contains(event.target) && !document.getElementById("logout-window").classList.contains('hide-floating')) {
    unfocusWrapper();
    toggleLogOut();
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
  }else if(response.status == 409){
    alert('user already exists');
  } else{
    alert('there has been an error in the signup procedure. try again later');
  }})
})
document.getElementById("button-login").addEventListener('click', function(){
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  login(username, password);
  toggleLogin();
  unfocusWrapper();
})

document.getElementById('button-playlist').addEventListener('click', function(){
  const data = {name : document.getElementById("playlist-name").value, trackIds : playlistSongs}
  fetch('https://kset.home.asidiras.dev/playlist/', 
  {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearer,
    },
    body: JSON.stringify(data) ,
  }).then((response) => {if(response.status == 201){
    playlistSongs = [];
    togglePlaylist();
    unfocusWrapper();
  }})
}
);
document.getElementById("playlist-search-bar").addEventListener('keyup', ()=>{
  let search = document.getElementById("playlist-search-bar").value;
  fetch(`https://kset.home.asidiras.dev/track/?search=${search}&index=0&size=999`, {method: 'GET'})
  .then((response) => response.json())
  .then((data) => {
    document.getElementById('search-results').innerHTML='';
    for(let result of data){
      createSearchResult(result.title, result.id);
    }
  })
})
document.getElementById("playlist-search-bar-2").addEventListener('keyup', ()=>{
  let search = document.getElementById("playlist-search-bar-2").value;
  fetch(`https://kset.home.asidiras.dev/track/?search=${search}&index=0&size=999`, {method: 'GET'})
  .then((response) => response.json())
  .then((data) => {
    document.getElementById('search-results-2').innerHTML='';
    for(let result of data){
      createSearchResult(result.title, result.id, '-2');
    }
  })
})

// Event Listeners ----------------------------------------------------------------------------------------
/*
 * https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
*/
function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

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
function createPlaylist(playlist, location){
  let playlistdom = document.createElement('div');
  playlistdom.classList.add('playlist');
  let name = document.createElement('b');
  name.classList.add('text');
  name.classList.add('underlined');
  name.textContent = playlist.name;
  let playlistSongs = document.createElement('div');
  playlistSongs.classList.add('playlist');
  playlistdom.appendChild(name);
  playlistdom.appendChild(playlistSongs);
  const myHeaders = new Headers();
  myHeaders.append('Authorization', bearer);
  fetch(`https://kset.home.asidiras.dev/playlist/${playlist.id}`, {method: 'GET', headers: myHeaders})
  .then((response) => response.json())
  .then((data) => {
    for(let track of data.tracks){
      let playlistSong = document.createElement('div');
      playlistSong.classList.add('playlist-song');
      let playbutton = document.createElement('img');
      playbutton.src = "assets/play.webp"
      playbutton.classList.add('playlist-item-play');
      playbutton.addEventListener('click', ()=> {
        let source = document.getElementById("source");
        source.src = `https://kset.home.asidiras.dev/stream/download/${track.path}`;
        let audio = document.getElementById("audio");
        const footer = document.getElementById("footer");
        if(footer.classList.contains("hide-floating")){
          footer.classList.toggle("hide-floating");
        }
        audio.load()
        audio.play()
      })
      let cover = document.createElement('img');
      cover.classList.add('playlist-item-cover');
      cover.src = `https://kset.home.asidiras.dev/album/cover/${track.cover}`;
      let title = document.createElement('b');
      title.classList.add('text');
      title.textContent = track.title
      playlistSong.appendChild(playbutton);
      playlistSong.appendChild(cover);
      playlistSong.appendChild(title);
      playlistSongs.appendChild(playlistSong);
    }
  })
  document.getElementById(location).appendChild(playlistdom);
}

function displayAccountInformation() {  // Still need to make functional
  const account = document.getElementById('account');
  const numSections = account.getElementsByClassName('account-section').length
  for (var i=0; i<numSections; i++){
    account.removeChild(account.getElementsByClassName('account-section')[0]);
  }

  const fields = ['Username', 'Password', 'Name', 'Email', 'Date of Birth']
  for (var i=0; i<fields.length; i++) {
    const section = document.createElement('h3');
    section_text = document.createTextNode(fields[i].concat(': '));
    section.appendChild(section_text);
    
    section_bar = document.createElement('div');
    section_bar.classList.add('section-bar');
    input_form = document.createElement('form');
    input_bar = document.createElement('input');
    input_bar.classList.add('text');
    input_bar.classList.add('input-bar');
    reset_btn = document.createElement('input')
    reset_btn.setAttribute('type', 'reset');
    reset_btn.setAttribute('value', 'X');
    reset_btn.classList.add('text', 'clear-input');
    if (getCookie(fields[i].toLowerCase()) == undefined) {
      input_bar.setAttribute('placeholder', fields[i]);
    } else {
      if (fields[i]=="Password") {
        input_bar.setAttribute('placeholder', getCookie(fields[i].toLowerCase()).slice(0,4) + "•••");
      } else {
        input_bar.setAttribute('placeholder', getCookie(fields[i].toLowerCase()));
      }
    }
      input_form.appendChild(input_bar);
      input_form.appendChild(reset_btn);
      section_bar.appendChild(input_form);
      section.appendChild(section_bar);

      section.classList.add('text');
      section.classList.add('account-section');
      account.appendChild(section);
  }
  
  submit_button = document.createElement('button');
  button_text = document.createTextNode("Save");
  submit_button.appendChild(button_text);
  submit_button.classList.add('sign-button')
  submit_button.classList.add("text");
  submit_button.classList.add("fade");
  submit_button.classList.add('account-section');
  account.appendChild(submit_button);
}

function displayTopArtists() {
  // var artists = [];
  // content = document.getElementById("content");
  // fetch('https://kset.home.asidiras.dev/track/?search&index=0&size=999', {method: 'GET'})
  // .then((response) => response.json())
  // .then((data) => {
  //   data.sort(function(a, b) {
  //     let keyA = a.title.toUpperCase();
  //     let keyB = b.title.toUpperCase();
  //     if (keyA < keyB) return -1;
  //     if (keyA > keyB) return 1;
  //     return 0;
  //   });
  //   for (var i=0; i<data.length; i++) { // Add artists names from ids
  //     let artist = data[i]["path"].substr(0,data[i]["path"].indexOf('-'));
  //     if (!artists.includes(artist)) {artists.push(artist);} // Only add unique artists
  //   }
  //   alert(artists);
  // })
  // return artists;
}

function displayLikedSongs() {  // Display liked songs stored in a global variable likedSongs
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
    for (var i=0; i<data.length; i++) {
      if (likedSongs.includes(data[i]["title"])) {
        let imgSrc = data[i]["cover"];
        let songSrc = data[i]["data"];
        let title = data[i]["title"];

        const track = document.createElement('div');
        track.classList.add('track');
        // create cover element
        const cover = document.createElement('img');
        cover.setAttribute("id", `${songSrc}|${imgSrc}`);
        cover.setAttribute("loading", "lazy");
        cover.classList.add('cover');
        cover.src = `https://kset.home.asidiras.dev/album/cover/${imgSrc}`;
      
        // Play Button
        const playWrapper = document.createElement('div');
        playWrapper.classList.add('play-wrapper');
        const play = document.createElement('img');
        play.setAttribute("loading", "lazy");
        play.classList.add('play');
        play.src = "assets/play.webp";
        playWrapper.appendChild(play);
      
        // Like Button
        const likeWrapper = document.createElement('div');
        likeWrapper.classList.add('like-wrapper');
        const like = document.createElement('img');
        like.setAttribute("loading", "lazy");
        like.classList.add('like');
        like.src = "assets/liked.webp";
        like.classList.add("liked");
        likeWrapper.appendChild(like);
        like.addEventListener("mouseup", function(){
          if (like.classList.contains("liked")){
            like.src = "assets/unliked.webp";
            likedSongs.splice(likedSongs.indexOf(title),1);
          } else {
            like.src = "assets/liked.webp";
            likedSongs.push(title);
          }
          like.classList.toggle("liked");
        });
        
        // create the title
        const text = document.createElement('p');
        text.classList.add('title');
        text.textContent = title
        // put cover and title inside track
        track.appendChild(playWrapper);
        track.appendChild(likeWrapper);
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
          const footer = document.getElementById("footer");
          if(footer.classList.contains("hide-floating")){
            footer.classList.toggle("hide-floating")
          }
          audio.load()
          audio.play()
        });
        const likes = document.getElementById("liked-songs");
        likes.appendChild(track);
      }
    }
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

function createSearchResult(songName, songId, index=''){
  let searchResults = document.getElementById('search-results'+index);
  let resultItem = document.createElement('div')
  resultItem.classList.add('result-item');
  let name = document.createElement('b')
  name.classList.add('text');
  name.textContent = songName;
  let img = document.createElement('img')
  img.classList.add('item-add-img');
  img.src = "assets/plus.webp";
  img.addEventListener('click', function(){
    playlistSongs.push(songId);
  });
  resultItem.appendChild(name);
  resultItem.appendChild(img);
  searchResults.appendChild(resultItem);
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

  // Play Button
  const playWrapper = document.createElement('div');
  playWrapper.classList.add('play-wrapper');
  const play = document.createElement('img');
  play.setAttribute("loading", "lazy");
  play.classList.add('play');
  play.src = "assets/play.webp";
  playWrapper.appendChild(play);

  // Like Button
  const likeWrapper = document.createElement('div');
  likeWrapper.classList.add('like-wrapper');
  const like = document.createElement('img');
  like.setAttribute("loading", "lazy");
  like.classList.add('like');
  like.src = "assets/unliked.webp";
  likeWrapper.appendChild(like);
  like.addEventListener("mouseup", function(){
    
    if (like.classList.contains("liked")){
      like.src = "assets/unliked.webp";
      likedSongs.splice(likedSongs.indexOf(title),1);
    } else {
      like.src = "assets/liked.webp";
      likedSongs.push(title);
    }
    like.classList.toggle("liked");
  });
  
  // create the title
  const text = document.createElement('p');
  text.classList.add('title');
  text.textContent = title
  // put cover and title inside track
  track.appendChild(playWrapper);
  track.appendChild(likeWrapper);
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
    const footer = document.getElementById("footer");
    if(footer.classList.contains("hide-floating")){
      footer.classList.toggle("hide-floating")
    }
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
function toggleLogOut(){
  const playlist  = document.getElementById('logout-window');
  playlist.classList.toggle('hide-floating');
  playlist.classList.toggle('focus');
}

function setCookie(name, value, options = {}) {
  var date = new Date();
  date.setTime(date.getTime()+(60*24*60*60*1000)); // 60 days
  options = {
    path: '/',
    expire: date,
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
  // fill();
  const cookieUsername = getCookie('username');
  const cookiePassword = getCookie('password');
  const data = {username: username?username:cookieUsername, password: password?password:cookiePassword};
  fetch('https://kset.home.asidiras.dev/auth/signin', 
  {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) ,
  }).then((response) => {
    if(response.status == 201){
    document.getElementById("nav-signup").classList.toggle("hide-floating");
    document.getElementById("nav-login").classList.toggle("hide-floating");
    document.getElementById("profile-options").classList.toggle("hide-floating");
    document.getElementById('banner').style = 'display: none';
    const cookieUsername = getCookie('username');
    const cookiePassword = getCookie('password');
    if(!(cookieUsername && cookiePassword)){
      setCookie('username', username, {secure: true, 'max-age': 3600*24*30, SameSite: 'None'});
      setCookie('password', password, {secure: true, 'max-age': 3600*24*30, SameSite: 'None'});
    }
    if(username){
      document.getElementById('profile-image').src = `https://avatars.dicebear.com/api/bottts/${username}.svg`
    }
    if(data.username){
      document.getElementById('profile-image').src = `https://avatars.dicebear.com/api/bottts/${data.username}.svg`
    }
    response.json().then((value)=>{
      bearer = 'Bearer '+value.accesToken;
      const myHeaders = new Headers();
      myHeaders.append('Authorization', bearer);
      fetch('https://kset.home.asidiras.dev/playlist/?index=0', 
      {
        method: 'GET', 
        headers: myHeaders,
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      for(let playlists of data){
        createPlaylist(playlists, 'playlist-selection');
      }
    })
    });
    
  } else{
    if(username!='' && password!=''){
      alert('Wrong email or password !');
    }
  }})}
function switchContent(div) {
  const objects = ['content', 'playlist-selection', 'account', 'profile', 'logout'];
  for (var i=0; i<objects.length; i++) {
    document.getElementById(objects[i]).classList.add('hide-floating');
  }
  document.getElementById(objects[objects.indexOf(div)]).classList.remove('hide-floating');
  if (div == "content") {
    document.getElementById('right_column').style.overflowY = "auto";
  } else {
    // document.getElementById('right_column').style.overflowY = "clip";
  }
}