#MAIN RESOURCE USED:
##environment set-up
https://www.codementor.io/valentinrad/roll-your-own-tiny-react-environment-using-webpack-babel-and-sass-ei70wyhjl

##fonts and icons
https://fontawesome.com/
https://fonts.google.com/

##dummy data
https://www.json-generator.com/

#NOTES ABOUT THE INCOMING DATA:
A real-world dataset would have unique a unique id for each entry. Since the challenge did not specify one, I had to create unique keys within the jsx (for example: key={'sortOption'+i}). One ramification is that a given entry will not have the same unique identifier from sort to sort.

The dummy data has all but the zipcode stored as strings.

#NOTES ABOUT IMPLEMENTATION:
Overarching structure was not specified. I chose to implement a separate, dummy navbar component (since that would typically be a completely separate component in a real-world scenario), and then all of the other functionality within the page-table component.

Behavior when choosing a listbox option was also not given in detail. I choose to implement them as follows: if the user changes the number of items per page, the results will still contain the item that was previously at the top of the page. If the user changes the sort order, it starts a fresh search.

Behavior when clicking on a an already-selected column header was not specified in detail. I choose to allow toggling between ascending and descending sort order.
