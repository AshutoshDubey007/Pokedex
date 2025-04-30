# **App Name**: PokeSearch

## Core Features:

- Pokemon Display: Display a list of Pokémon cards with name, image, type(s), and ID.
- Real-time Search: Implement a search input to filter Pokémon by name in real-time.
- Type Filter: Add a dropdown to filter Pokémon by type (Fire, Water, Grass, etc.).

## Style Guidelines:

- Primary color: Pokemon Yellow (#FFCB05) for a vibrant theme.
- Secondary color: Pokemon Blue (#30A7DF) for contrast.
- Accent: Red (#FF0000) for important actions or alerts.
- Use a grid layout for displaying Pokémon cards, ensuring responsiveness on all devices.
- Utilize simple and recognizable icons for Pokémon types (Fire, Water, Grass, etc.).

## Original User Request:
Overview:-
Build a React application that fetches data from the PokeAPI (https://pokeapi.co/) and allows users to search and filter through Pokémon. This application should display a list of Pokémon with basic information and allow users to filter them based on search terms.

Requirements:-
1. Data Fetching
- Fetch the first 150 Pokémon from the PokeAPI
- Display each Pokémon in a card layout showing:
   - Name
   - Image (sprite)
   - Type(s)
   - ID number

2. Search Functionality
- Implement a search input that filters Pokémon by name in real-time
- Add a filter dropdown to filter Pokémon by type (Fire, Water, Grass, etc.)
- Show appropriate loading and empty states

3. UI/UX
- Create a responsive design that works on both desktop and mobile devices
- Include a simple header with the application name
- Style the application with CSS (or a CSS framework of your choice)


Technical Requirements:
- Use functional components with React Hooks
- Implement proper loading and error states
- Structure your code with reusable components
- Handle edge cases (no results, API errors, etc.)


Resources:
- PokeAPI Documentation: https://pokeapi.co/docs/v2
- Example endpoint for Pokémon list: https://pokeapi.co/api/v2/pokemon?limit=150
  