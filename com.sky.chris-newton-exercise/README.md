![Sky](./sky-logo.png)
# Interview Exercise

In this repository you will find my submission for the 2nd stage coding exercise.

I chose `OPTION 2: Movie Catalogue:`

I started the exercise by reading the supplied documentation and running some of the examples. Before starting the exercise, I investigated the best way of testing the view I was going to create. I decided that visual regression testing would be a good way to go as the application is rendered in a single canvas element using webGL and as such is quite difficult to recreate in a unit test.

Once I had setup the testing framework (Cypress.io) I thought about how best to complete the exercise. I decided to use the design/UX of an existing TV app to accelerate the development process.

I decided that the application would consist of 3 main components.
- A list/carousel of the Movies
- A Header to contain the specific information about each movie.
- The main App component that would control the other two.

Upon app initialisation the movie data is imported and used to dynamically create the Movie List items. The state is then updated so that the Movie List has focus for keyboard input.

When the user navigates left or right a signal is triggered with the current index of the list item. This signal is consumed by the main App component. The main app component then animates a box to highlight the current movie item and then sends the current index through to the Header component so that it updates the corresponding information for the currently selected Movie.
