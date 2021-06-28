# Sequelize Library App
___
## Express-based application utilizing SQLite and Sequelize to organize a library inventory
___
### Before we begin...[^1]
___
### How it works:

The application is built using the Express framework under the hood. The goal of the program is to enable the display, edit, creation, and deletion of Genericville's local library. In order to accomplish this, I have imported Sequelize and SQLite to enable the creation and manipulation of table data via JS ORM commands. For viewing, I am implementing Pug templates to convert to HTML.

I have broken up the functionality of the application with a few different views:

- The layout view is at the root of the application, laying out the introductory code supplying the skeleton tags so to speak.

- The index page pulls all records from the library.db file, displaying a table of all existing records for browsing. Note in this view the sequelize instance is limited to 8 records per page using the 'limit' and 'offset' properties within the 'findAll' method. As a result of the pagination feature, I have generated a second route to supply the database listings cut off by the 'limit' property.

- The new book view supplies an empty form allowing users to submit a new book listing to the library.db file. The GET call retrieves the form while the POST call attempts to generate a new Book model instance based on the user input. Sequelize allows validations to be run inside the model and generates validation errors upon failure. I have utilized Sequelize validation to ensure values are input inside the fields for new book submissions, including the 'isNumeric' validation to ensure the 'Year' field is submitted with numbers.

- The update book view is identical in function to the new book view with the exception that the book values for the user-selected book are pulled into the input fields by default. From here, users are able to make any field edits within the validation requirements provided by the Sequelize model or else delete the book. The delete button places a call to the delete route which implements the Sequelize 'destroy' method to pull the record from library.db. 

- If any validators fail the Sequelize validation requirements in either update or new book views, the user is directed to the form error view. The validation error(s) is / are passed along to this view and displayed at the heading of their respective layouts. I have used the conditional functionality offered in Pug to display either the new book or update book views based on whether or not a book object is supplied to the view. This view is determined within each POST route call within the try / catch block.
___
### CSS Changes
___
- Updated font choice to Raleway for a sleeker design
- Created 'fancy' class to display additional image I created for header background
- Updated color scheme to match colors used in header image including link backgrounds, hover backgrounds, border lines, and fonts
- Applied border radius to input on search bar and links
- Generated SVG for use with search bar
- Created classes to frame pagination list in an inline view  below table and underline page numbers

[^1]: This application requires you to run the command "npm start" in your console at the project's folder location then point your browser to "localhost:3000" to view.




