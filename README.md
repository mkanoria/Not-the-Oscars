# Shoppies 🎬

This is my submission for the Shopify Frontend Development Challenge (Summer '21)

## Demo Link

Check it out at [https://mkanoria.github.io/Not-the-Oscars](https://mkanoria.github.io/Not-the-Oscars)

## Core Features

- Search results should come from OMDB's API ✅
- Each search result should list at least its title, year of release and a button to nominate that film.✅
- Updates to the search terms should update the result list ✅
- Movies in search results can be added and removed from the nomination list. ✅
- If a search result has already been nominated, disable its nominate button. ✅
- Display a banner when the user has 5 nominations. ✅

### Extras features
- Storing a user's nomination list in the browser's local storage, helping persist information across sessions
- Infinite scroll to browse search results - using pagination on the OMDB search API
- Animations for adding/deleting movies from nomination lists
- Get plot details and the IMDB rating while browsing movies

## Installing

First, clone the repository, and `cd` into the project directory  
Run `npm install` to download and update all the required dependencies

## Running locally

Run `npm start`  
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Tech Stack

Uses React and JavaScript  
Components are built from [`material-ui`](http://material-ui.com/)

## Future improvements

- Add tests
- Add user authentication (using OAuth)
- More interactive Modal to get information of selected movies
- Added debounce to reduce OMDB API search calls while looking for movies

---

Thanks for checking out my submission! Pls hire 🥺

---
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).