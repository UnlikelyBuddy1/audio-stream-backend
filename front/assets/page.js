login();  // Check for cookies and sign in if they exist
fill();   // Load content from Back-end

var playlistSongs=[];
var bearer='';
var artists=[];
var likedSongs=[];

const searchBar = document.getElementById("search-bar");
const signupPassword = document.getElementById("signup-password");

// document.getElementById("signup-password").value;
document.getElementById('seek-slider').max = 0;
const volumeSlider = document.getElementById('volume-slider');

let playState = null;
let volume = 100;


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
function signup(username, password) { // Signup Function
  // const username = document.getElementById("signup-username").value;
  // const password = document.getElementById("signup-password").value;

  if (username == ''){ // No username entered
    document.getElementById('signup-no-account').classList.remove('hide-floating');
    document.getElementById('signup-username').classList.add('sign-error');
    return 1;
  } else document.getElementById('signup-no-account').classList.add('hide-floating');

  if (password == '') { // No password entered
    document.getElementById('signup-no-password').classList.remove('hide-floating');
    return 1;
  } else document.getElementById('signup-no-password').classList.add('hide-floating');

  if ((document.getElementById('signup-password').classList.contains('sign-error')) && (document.getElementById('signup-password').value != '')) { // Unsatisfactory Password
    document.getElementById('signup-password-error').classList.remove('hide-floating');
    return 1;
  } else document.getElementById('signup-password-error').classList.add('hide-floating');

  if (!document.getElementById('signup-checkbox').checked) { // Checkbox ticked
    document.getElementById('signup-terms-error').classList.remove('hide-floating');
    return 1;
  } else document.getElementById('signup-terms-error').classList.add('hide-floating');
  


  const data = {username, password};
  fetch('https://kset.home.asidiras.dev/auth/signup', 
  {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data) ,
  })
  .then((response) => {
    if(response.status == 201){ // Successful Sign up
      document.getElementById('login-page').classList.add('hide-floating');
      document.getElementById('wrapper').classList.remove('hide-floating');
      toggleSignup();
    } else if (response.status == 409){ // Account Already exists
      // alert('An account with that username already exists');
      document.getElementById('signup-account-error').classList.remove('hide-floating');
      document.getElementById('signup-username').classList.add('sign-error');
    } else { // Other Error
      // alert('There has been an error in the signup procedure. try again later');
      document.getElementById('signup-error').classList.remove('hide-floating');
    }
  })
  if(username){
    document.getElementById('profile-image').src = `https://avatars.dicebear.com/api/bottts/${username}.svg`
  }
  if(data.username){
    document.getElementById('profile-image').src = `https://avatars.dicebear.com/api/bottts/${data.username}.svg`
  }
}
function fill(){
  let content = document.getElementById("content");
  fetch('https://kset.home.asidiras.dev/genre/?search&index=0&size=99', {method: 'GET'})
  .then((response) => response.json())
  .then((genres) => {
    genres.map((genre) => {
      let section = document.createElement('h3');
      section_text = document.createTextNode(genre.name);
      section.appendChild(section_text);
      section.classList.add('text');
      section.classList.add('section');
      content.appendChild(section);
      console.log(genre);
      genre.tracks.map((track) => {
          let artists = (track.artists.map((artist) => {return artist.name})).join(', ');
          let DOM_track = createTrack(track["cover"], track["path"], track["title"], artists);
          content.appendChild(DOM_track);
        });
        const spacer = document.createElement('div');
        content.appendChild(spacer);
      });
    });
  }

function createPlaylist(playlist, location){
  let playlistdom = document.createElement('div');
  playlistdom.classList.add('playlist-wrapper');
  let name = document.createElement('b');
  name.classList.add('text');
  name.classList.add('big-text');
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
          document.getElementById("right-column").style.height = 'calc(100% - 55px - 70px)';
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
  submit_button.classList.add("login-button");
  submit_button.classList.add("button");
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

// function displayLikedSongs() {  // Display liked songs stored in a global variable likedSongs
//   fetch('https://kset.home.asidiras.dev/track/?search&index=0&size=999', {method: 'GET'})
//   .then((response) => response.json())
//   .then((data) => {
//     data.sort(function(a, b) {
//       let keyA = a.title.toUpperCase();
//       let keyB = b.title.toUpperCase();
//       if (keyA < keyB) return -1;
//       if (keyA > keyB) return 1;
//       return 0;
//     });
//     for (var i=0; i<data.length; i++) {
//       if (likedSongs.includes(data[i]["title"])) {
//           likedTrack = createTrack(data[i]["cover"], data[i]["path"], data[i]["title"], data[i]["path"].substr(0,data[i]["path"].indexOf('-')));
        // let imgSrc = data[i]["cover"];
        // let songSrc = data[i]["data"];
        // let title = data[i]["title"];

        // const track = document.createElement('div');
        // track.classList.add('track');
        // // create cover element
        // const cover = document.createElement('img');
        // cover.setAttribute("id", `${songSrc}|${imgSrc}`);
        // cover.setAttribute("loading", "lazy");
        // cover.classList.add('cover');
        // cover.src = `https://kset.home.asidiras.dev/album/cover/${imgSrc}`;
      
        // // Play Button
        // const playWrapper = document.createElement('div');
        // playWrapper.classList.add('play-wrapper');
        // const play = document.createElement('img');
        // play.setAttribute("loading", "lazy");
        // play.classList.add('play');
        // play.src = "assets/play.webp";
        // playWrapper.appendChild(play);
      
        // // Like Button
        // const likeWrapper = document.createElement('div');
        // likeWrapper.classList.add('like-wrapper');
        // const like = document.createElement('img');
        // like.setAttribute("loading", "lazy");
        // like.classList.add('like');
        // like.src = "assets/liked.webp";
        // like.classList.add("liked");
        // likeWrapper.appendChild(like);
        // like.addEventListener("mouseup", function(){
        //   if (like.classList.contains("liked")){
        //     like.src = "assets/unliked.webp";
        //     likedSongs.splice(likedSongs.indexOf(title),1);
        //   } else {
        //     like.src = "assets/liked.webp";
        //     likedSongs.push(title);
        //   }
        //   like.classList.toggle("liked");
        // });
        
        // // create the title
        // const text = document.createElement('p');
        // text.classList.add('title');
        // text.textContent = title
      
        // // put cover and title inside track
        // track.appendChild(playWrapper);
        // track.appendChild(likeWrapper);
        // track.appendChild(cover);
        // track.appendChild(text);
        
        // // add event listener to change track
        // cover.addEventListener("mousedown", (e)=> {
        //   let id = (e.target.id);
        //   const songSrc = id.split('|')[0];
        //   const imgSrc = id.split('|')[1];
        //   let source = document.getElementById("source");
        //   source.src = `https://kset.home.asidiras.dev/stream/download/${songSrc}`;
        //   let miniCover = document.getElementById("miniCover");
        //   miniCover.src = `https://kset.home.asidiras.dev/album/cover/${imgSrc}`;
        //   let audio = document.getElementById("audio");
        //   const footer = document.getElementById("footer");
        //   if(footer.classList.contains("hide-floating")){
        //     footer.classList.toggle("hide-floating")
        //     document.getElementById("right-column").style.height = 'calc(100% - 55px - 70px)';
        //   }
        //   audio.load()
        //   audio.play()
        // });
        //const likes = document.getElementById("liked-songs");
        //likes.appendChild(track);
//       }
//     }
//   })
// }

// function displayProfileInformation() {  // Need to implement favorite artists, playlists, etc...
//   const profile = document.getElementById('profile');
//   const numSections = profile.getElementsByClassName('profile-section').length;
//   for (var i=0; i<numSections; i++){
//     profile.removeChild(profile.getElementsByClassName('profile-section')[0]);
//   }

//   // const fields = ['Your Top Artists', 'Your Top Songs', 'Liked Songs', 'Your Playlists', 'People Following You']
//   const fields = ['Liked Songs']
//   for (var i=0; i<fields.length; i++) {
//     const section = document.createElement('div');
//     section_text = document.createTextNode(fields[i].concat(': '));
//     section_bar = document.createElement('div');

//     switch (i) {
//       // case 0:
//         // let artists = displayTopArtists();
//         // // alert(artists.length);
//         // for (var i=0; i<artists.length; i++) {
//         //   artist_name = document.createTextNode(artists[i]);
//         //   section.appendChild(artist_name);
//         // }
//         // break;

//       // case 3:
//       case 0:
//         section_bar.setAttribute("id", "liked-songs");
//         displayLikedSongs();
//       default:
//     }

//     section_bar.classList.add('section-bar');
//     section.classList.add('text');
//     section.appendChild(section_bar);
//     section.appendChild(section_text);
//     section.classList.add('profile-section');
//     section.classList.add('section');
//     profile.appendChild(section);
//   }
// }

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//profile page -- use mostly the same css as artist page
function displayProfileInformation(){
  let profile = document.getElementById("profile");
  profile.innerHTML= ' ';

  //title -- change to include username
  // const profileName = document.createElement('h3');
  // profileName_text = document.createTextNode("Your Profile");
  // profileName.appendChild(profileName_text);
  // profileName.classList.add('artist-name')
  // profile.appendChild(profileName);

  //img, listeners, followers, and casette all in one container
  rowContainer = document.createElement('div');
  rowContainer.classList.add('artist-row-container');
  profile.appendChild(rowContainer)
  
  //profile picture
  const profileImg = document.createElement('img');
  profileImg.src=document.getElementById('profile-image').src
  profileImg.alt = "artist image";
  profileImg.classList.add('artist-img');
  rowContainer.appendChild(profileImg);

  //listening time and followers placeholder
  const profileStats = document.createElement('div');
  const minutesListened = document.createElement('h3');
  minutesListened_text = document.createTextNode("-- minutes listened");
  const profileFollowers = document.createElement('h3');
  profileFollowers_text = document.createTextNode("-- followers");
  minutesListened.appendChild(minutesListened_text);
  profileFollowers.appendChild(profileFollowers_text);
  minutesListened.classList.add('artist-stats-text');
  profileFollowers.classList.add('artist-stats-text');
  profileStats.appendChild(minutesListened);
  profileStats.appendChild(profileFollowers);
  profileStats.classList.add('artist-stats-container');
  rowContainer.appendChild(profileStats);
  
  const profileCasette = document.createElement('img');
  profileCasette.src = "assets/icon_notext.webp";
  profileCasette.classList.add('artist-casette');
  rowContainer.appendChild(profileCasette);



  //Your Top Artists
  const topArtists = document.createElement('h3');
  topArtists_text = document.createTextNode("Your Top Artists");
  topArtists.appendChild(topArtists_text);
  topArtists.classList.add('section');
  topArtists.classList.add('artist-stats-text');
  profile.appendChild(topArtists);

  let topArtistsContent = document.createElement('div');
  topArtistsContent.classList.add('artist-content');
  profile.appendChild(topArtistsContent);

  //your top tracks
  const topTracks = document.createElement('h3');
  topTracks_text = document.createTextNode("Your Top Tracks");
  topTracks.appendChild(topTracks_text);
  topTracks.classList.add('section');
  topTracks.classList.add('artist-stats-text');
  profile.appendChild(topTracks);

  let topTracksContent = document.createElement('div');
  topTracksContent.classList.add('artist-content');
  profile.appendChild(topTracksContent);


  //fake top tracks and artists by grabbing from range in json
  fetch('https://kset.home.asidiras.dev/track/?search&index=0&size=999', {method: 'GET'})
    .then((response) => response.json())
    .then((data) => {
      for(let i=0; i<6; i++){
        track = createTrack(data[i]["cover"], data[i]["path"], data[i]["title"], data[i]["path"].substr(0,data[i]["path"].indexOf('-')));
        topTracksContent.appendChild(track);
      }
      for(let i=48; i<54; i++){
        artistIcon = createArtistIcon(data[i]["cover"], data[i]["path"].substr(0,data[i]["path"].indexOf('-')));
        topArtistsContent.appendChild(artistIcon);
      }
    })



  //your liked songs
  const likedTracks = document.createElement('h3');
  likedTracks_text = document.createTextNode("Your Likes");
  likedTracks.appendChild(likedTracks_text);
  likedTracks.classList.add('section');
  likedTracks.classList.add('artist-stats-text');
  profile.appendChild(likedTracks);

  let likedTrackContent = document.createElement('div');
  likedTrackContent.classList.add('artist-content');
  profile.appendChild(likedTrackContent);

  fetch('https://kset.home.asidiras.dev/track/?search&index=0&size=999', {method: 'GET'})
  .then((response) => response.json())
  .then((data) => {
    for (var i=0; i<data.length; i++) {
      if (likedSongs.includes(data[i]["title"])) {
          likedTrack = createTrack(data[i]["cover"], data[i]["path"], data[i]["title"], data[i]["path"].substr(0,data[i]["path"].indexOf('-')));
          likedTrackContent.appendChild(likedTrack);
      }
    }
  })

}

function displayArtistInformation(artist){
  //clear page before loading new one
  let artistProfile = document.getElementById("artist-profile");
  artistProfile.innerHTML= ' ';

  //title
  const artistName = document.createElement('h3');
  artistName_text = document.createTextNode(artist);
  artistName.appendChild(artistName_text);
  artistName.classList.add('artist-name')
  artistProfile.appendChild(artistName);

  //img, listeners, followers, and casette all in one container
  rowContainer = document.createElement('div');
  rowContainer.classList.add('artist-row-container');
  artistProfile.appendChild(rowContainer)

  //artist img -- img from album
  const artistImg = document.createElement('img');
  artistImg.alt = "artist image";
  artistImg.classList.add('artist-img');
  rowContainer.appendChild(artistImg);

  //listeners and followers/follow button placeholder
  const artistStats = document.createElement('div');

  const artistListeners = document.createElement('h3');
  artistListeners_text = document.createTextNode("-- listeners");
  const artistFollowers = document.createElement('h3');
  artistFollowers_text = document.createTextNode("-- followers");
  //follow button -- needs to be linked to a follow function
  const followButton = document.createElement('button');
  followButton_text = document.createTextNode("Follow")

  artistListeners.appendChild(artistListeners_text);
  artistFollowers.appendChild(artistFollowers_text);
  followButton.appendChild(followButton_text);

  artistListeners.classList.add('artist-stats-text');
  artistFollowers.classList.add('artist-stats-text');
  followButton.classList.add('follow-button');
  artistStats.appendChild(artistListeners);
  artistStats.appendChild(artistFollowers);
  artistStats.appendChild(followButton);

  artistStats.classList.add('artist-stats-container');
  rowContainer.appendChild(artistStats);

  //casette of artist top songs -- not functional
  const artistCasette = document.createElement('img');
  artistCasette.src = "assets/icon_notext.webp";
  artistCasette.classList.add('artist-casette');
  rowContainer.appendChild(artistCasette);

  //display all songs by artist from json
  const section = document.createElement('h3');
  section_text = document.createTextNode("Discography");
  section.appendChild(section_text);
  section.classList.add('section');
  section.classList.add('artist-stats-text');
  artistProfile.appendChild(section);

  let content = document.createElement('div');
  content.classList.add('artist-content');
  artistProfile.appendChild(content);

  //similar artists section -- implement using genre when updated json file is on server
  fetch('https://kset.home.asidiras.dev/track/?search&index=0&size=999', {method: 'GET'})
    .then((response) => response.json())
    .then((data) => {
      for(let i=0; i<data.length; i++){
        if (data[i]["path"].substr(0,data[i]["path"].indexOf('-')) == artist) {
          track = createTrack(data[i]["cover"], data[i]["path"], data[i]["title"], data[i]["path"].substr(0,data[i]["path"].indexOf('-')));
          content.appendChild(track);
          artistImg.src = `https://kset.home.asidiras.dev/album/cover/${data[i]["cover"]}`;
        }
      }
      for(let i=48; i<54; i++){
        artistIcon = createArtistIcon(data[i]["cover"], data[i]["path"].substr(0,data[i]["path"].indexOf('-')));
        similarArtistsContent.appendChild(artistIcon);
      }

    })

  const similarArtistsSection = document.createElement('h3');
  similarArtistsSection_text = document.createTextNode("Similar Artists");
  similarArtistsSection.appendChild(similarArtistsSection_text);
  similarArtistsSection.classList.add('section');
  similarArtistsSection.classList.add('artist-stats-text');
  artistProfile.appendChild(similarArtistsSection);

  let similarArtistsContent = document.createElement('div');
  similarArtistsContent.classList.add('artist-content');
  artistProfile.appendChild(similarArtistsContent);


}

function createArtistIcon(imgSrc, artist){

  const artistProfileIcon = document.createElement('div');
  artistProfileIcon.classList.add('artist-icon')

  const artistIcon = document.createElement('img');
  artistIcon.setAttribute("loading", "lazy");
  artistIcon.classList.add('artist-icon-cover');
  artistIcon.src = `https://kset.home.asidiras.dev/album/cover/${imgSrc}`;

  const artist_text = document.createElement('p'); 
  artist_text.classList.add('title');
  artist_text.textContent = artist;
  
  artistProfileIcon.addEventListener("click",function(){
    switchContent("artist-profile");
    displayArtistInformation(artist);
  })

  artistProfileIcon.appendChild(artistIcon);
  artistProfileIcon.appendChild(artist_text);
  return artistProfileIcon;
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

audio = document.getElementById("audio");
playPauseContainer = document.getElementById("play-pause-container");
let cb = null;
const seekSlider = document.getElementById('seek-slider');
const currentTime = document.getElementById('current-time');
const audioPlayer = document.getElementById('audio-player');

const whilePlaying = () => {
  seekSlider.value = Math.floor(audio.currentTime);
  currentTime.textContent = calculateTime(seekSlider.value);
  cb = requestAnimationFrame(whilePlaying);
  audioPlayer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
}

function createTrack(imgSrc, songSrc, title, artist){
  //create the track element
  const track = document.createElement('div');
  track.classList.add('track');
  // create cover element
  const cover = document.createElement('img');
  cover.setAttribute("id", `${songSrc}|${imgSrc}`);
  cover.setAttribute("loading", "lazy");
  cover.setAttribute("alt", `${title} by ${artist}`);
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
  //create artist title
  const artist_text = document.createElement('p'); 
  artist_text.classList.add('artist-title');
  artist_text.textContent = artist;
  artist_text.addEventListener("click",function(){
    switchContent("artist-profile");
    displayArtistInformation(artist);
  })
  // put cover and title inside track
  track.appendChild(playWrapper);
  track.appendChild(likeWrapper);
  track.appendChild(cover);
  track.appendChild(text);
  track.appendChild(artist_text);
  
  // add event listener to change track
  cover.addEventListener("mousedown", (e)=> {
    let id = (e.target.id);
    const songSrc = id.split('|')[0];
    const imgSrc = id.split('|')[1];
    // let source = document.getElementById("source");
    // source.src = `https://kset.home.asidiras.dev/stream/download/${songSrc}`;
    let audio = document.getElementById("audio");
    audio.src = `https://kset.home.asidiras.dev/stream/download/${songSrc}`;
    let miniCover = document.getElementById("miniCover");
    miniCover.src = `https://kset.home.asidiras.dev/album/cover/${imgSrc}`;
    // let audio = document.getElementById("audio");
    const footer = document.getElementById("footer");
    if(footer.classList.contains("hide-floating")){
      footer.classList.toggle("hide-floating")
      document.getElementById("right-column").style.height = 'calc(100% - 55px - 70px)';
    }
    audio.load();
    audio.play();
    requestAnimationFrame(whilePlaying);
    if (!playPauseContainer.classList.contains("pause")) {playPauseContainer.classList.add("pause");}
    document.getElementById("track-title").textContent = title;
    document.getElementById("track-artist").textContent = artist;
  });
  return track;
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
  playlist.classList.toggle('focus')
  playlist.classList.toggle('hide-floating');
  // playlist.classList.toggle('focus');
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
  const cookieUsername = getCookie('username');
  const cookiePassword = getCookie('password');
  const data = {username: username?username:cookieUsername, password: password?password:cookiePassword};

  return new Promise((res, rej) => {
    fetch('https://kset.home.asidiras.dev/auth/signin', 
    {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) ,
    }).then((response) => {
      if(response.status == 201){ // Login Successful
        document.getElementById('login-page').classList.add('hide-floating');
        document.getElementById('wrapper').classList.remove('hide-floating');
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
          // console.log(data);
          for(let playlists of data){
            createPlaylist(playlists, 'playlist-selection');
          }
        })
        });
      } else{ // Unsuccessful Login
        // if(username!='' && password!=''){
        //   alert('Wrong email or password !');
        // }
      }
      return response.status;
    })
    .then(data => {
      return res(data)
    })
  })
}
function switchContent(div) {
  const objects = ['content', 'playlist-selection', 'account', 'artist-profile','profile', 'logout-window'];
  for (var i=0; i<objects.length; i++) {
    console.log(objects[i]);
    document.getElementById(objects[i]).classList.add('hide-floating');
  }
  document.getElementById(objects[objects.indexOf(div)]).classList.remove('hide-floating');
}



const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}

function displayAudioDuration(secs) {
  duration = document.getElementById("duration");
  duration.textContent = calculateTime(secs);
}



const setSliderMax = () => {
  seekSlider.max = Math.floor(audio.duration);
}




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

document.getElementById("new-playlist").addEventListener('mouseup', function(){ // New Playlist Button
  unfocusWrapper();
  togglePlaylist();
})
document.getElementById("profile-options").addEventListener('mouseup', function() { // Profile Options
  document.getElementById("profile-menu").classList.toggle('hide-floating');
})
document.getElementById("account-button").addEventListener('mouseup', function() { // Account Button
  switchContent("account");
  displayAccountInformation();
})
document.getElementById("profile-button").addEventListener('mouseup', function() { // Profile Button
  switchContent("profile");
  displayProfileInformation();
})
document.getElementById("logout-button").addEventListener('mouseup', function() { // Logout Button
  unfocusWrapper();
  toggleLogOut();
})
document.getElementById("confirm-logout").addEventListener('mouseup', function() { // Confirm Logout Button
  deleteAllCookies();
  document.location.reload(true);
})
document.getElementById("cancel-search").addEventListener('mouseup', function() { // Cancel Search Button
  setTimeout(function() {
    searchMusicLibrary();
  }, 1)
})
document.addEventListener('mousedown', function handleClickOutsideBox(event) { // Unfocus Content When Floating Menu is Visible
  if (!document.getElementById('signup').contains(event.target) && !document.getElementById('signup').classList.contains('hide-floating')) {
    toggleSignup();
  }
  if (!document.getElementById('login').contains(event.target) && !document.getElementById('login').classList.contains('hide-floating')) {
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
searchBar.addEventListener('keyup', function(){ // Search while typing
  searchMusicLibrary();
});
signupPassword.addEventListener('keyup', function(){ // Check Password Requirements
  if((!/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(signupPassword.value)) || signupPassword.value.length<8){
    if(!signupPassword.classList.contains('sign-error')){ // Turn Red
      signupPassword.classList.add('sign-error')
    }
  } else {
    if(signupPassword.classList.contains('sign-error')){ // Remove Red Border
      signupPassword.classList.remove('sign-error')
    }
  }
});
document.getElementById("button-signup").addEventListener('click', function(){ // Signup Button
  signup(document.getElementById("signup-username").value, document.getElementById("signup-password").value);
})
document.getElementById("signup-username").addEventListener('keydown', function () {
  document.getElementById('signup-username').classList.remove('sign-error');
  document.getElementById('signup-account-error').classList.add('hide-floating');
})
document.getElementById("button-login").addEventListener('click', function(){
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  login(username,password).then(response => {
    if (response == 400) {
      document.getElementById("login-username").classList.add('sign-error');
      document.getElementById("login-password").classList.add("sign-error");
      document.getElementById("incorrect-field").classList.remove("hide-floating");
    } else {
      toggleLogin();
    } 
  })

})

document.getElementById('button-playlist').addEventListener('click', function(){ // Playlist Button
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
// document.getElementById("playlist-search-bar").addEventListener('keyup', ()=>{ // Song Search for Playlists
//   let search = document.getElementById("playlist-search-bar").value;
//   fetch(`https://kset.home.asidiras.dev/track/?search=${search}&index=0&size=999`, {method: 'GET'})
//   .then((response) => response.json())
//   .then((data) => {
//     document.getElementById('search-results').innerHTML='';
//     for(let result of data){
//       createSearchResult(result.title, result.id);
//     }
//   })
// })
// document.getElementById("playlist-search-bar-2").addEventListener('keyup', ()=>{ // Song Search for Playlists 2
//   let search = document.getElementById("playlist-search-bar-2").value;
//   fetch(`https://kset.home.asidiras.dev/track/?search=${search}&index=0&size=999`, {method: 'GET'})
//   .then((response) => response.json())
//   .then((data) => {
//     document.getElementById('search-results-2').innerHTML='';
//     for(let result of data){
//       createSearchResult(result.title, result.id, '-2');
//     }
//   })
// })
playPauseContainer.addEventListener('click', () => { // Switch Play and Pause Icons
  if (playState === 'play') {
    audio.play();
    requestAnimationFrame(whilePlaying);
    if (!playPauseContainer.classList.contains("pause")) {playPauseContainer.classList.add("pause");}
    playState = 'pause';
  } else {
    audio.pause();
    cancelAnimationFrame(cb);
    if (playPauseContainer.classList.contains("pause")) {playPauseContainer.classList.remove("pause");}
    playState = 'play';
  }
})
audio.addEventListener('loadedmetadata', () => { // Show Audio Duration
  displayAudioDuration(audio.duration);
  setSliderMax();
});
seekSlider.addEventListener('input', () => { // Change Current Time Text
  currentTime.textContent = calculateTime(seekSlider.value);
  if (!audio.paused) {
    cancelAnimationFrame(cb);
  }
});
seekSlider.addEventListener('change', () => { // Seek Slider
  audio.currentTime = seekSlider.value;
  if (!audio.paused) {
    requestAnimationFrame(whilePlaying);
  }
});
audio.addEventListener('timeupdate', () => { // Move Seek Slider Every Second
  currentTime.textContent = calculateTime(seekSlider.value);
});
// playPauseContainer.addEventListener('click', () => { // 
//   playPauseContainer.classList.toggle('pause');
// });
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value / 100;

  muted = document.getElementById("unmuted-speaker").classList.contains("hide-floating");
  if (muted) {
    document.getElementById("muted-speaker").classList.toggle("hide-floating");
    document.getElementById("unmuted-speaker").classList.toggle("hide-floating");
  }
});
document.getElementById('login-button').addEventListener('click', () => {
  toggleLogin();
})
document.getElementById('signup-button').addEventListener('click', () => {
  toggleSignup();
})
document.getElementById("speaker-icon").addEventListener('click', () => {
  document.getElementById("muted-speaker").classList.toggle("hide-floating");
  document.getElementById("unmuted-speaker").classList.toggle("hide-floating");

  muted = document.getElementById("unmuted-speaker").classList.contains("hide-floating");
  if (muted) {
    volume = volumeSlider.value;
    audio.volume = 0;
    volumeSlider.value = 0;
  } else {
    audio.volume = volume / 100;
    volumeSlider.value = volume;
  }
})

// Event Listeners ----------------------------------------------------------------------------------------