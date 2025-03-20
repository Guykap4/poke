# Pokemon API

This is an application to display the first 151 Pokemon.

# Running the app

## backend

cd backend && npm i && npm run dev

## frontend

cd frontend && npm i && npm run dev

# Tech and decisions

I use React queries to fetch data silently, with access to data all over the app - great for state managment.

node on express for routing.

TS both in BE and FE for comfortably working with the POKEAPI, and all over the app.

Parsing of the information took me by surprise - it required me getting data from three different APIs, and one of them had to be processed recursively (I'm looking at you evolution API).