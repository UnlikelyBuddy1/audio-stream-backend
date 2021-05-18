## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## EndPoints and what they do
### Auth 
http://pweb.tools.asidiras.dev/auth/
- **POST** Signup 
- **POST** Signin
### Track
http://pweb.tools.asidiras.dev/track
- **POST** Creates Track
- **GET** Get track by id
- **GET** Get track by search, also usefull to get all tracks
- **DELETE** Delets tracks
- **PATCH** Modify a track
### Album (Same as track but for album)
http://pweb.tools.asidiras.dev/album
- **POST** Creates 
- **GET** Get by id
- **GET** Get by search, also usefull to get all tracks
- **DELETE** Delets
- **PATCH** Modify
### Artist (Same as track but for artist)
http://pweb.tools.asidiras.dev/artist
- **POST** Creates
- **GET** Get by id
- **GET** Get by search, also usefull to get all tracks
- **DELETE** Delets
- **PATCH** Modify
### Genre (Same as track but for genre)
http://pweb.tools.asidiras.dev/genre
- **POST** Creates
- **GET** Get by id
- **GET** Get by search, also usefull to get all tracks
- **DELETE** Delets 
- **PATCH** Modify
### Playlist (Same as track but for playlist)
http://pweb.tools.asidiras.dev/playlist
- **POST** Creates
- **GET** Get by id
- **GET** Get by search, also usefull to get all tracks
- **DELETE** Delets 
- **PATCH** Modify
### Stream
http://pweb.tools.asidiras.dev/stream
- **GET** + name of song, streams you the song
- **GET** gets you a html file (not usefull for you, just a demo)
http://pweb.tools.asidiras.dev/stream/download/
- **GET** +/download/ + name of song Downloads the song

## Go and see the DTOs of each entitie to see what you need to send, and also check the controllers for more info

Adrianos Sidiras Galante

