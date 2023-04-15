# Fyle Frontend Challenge-Hilag Shah

## Challange solutions:-

* [X] Implement Search by book title or author name - Implementation in src/app/components/home/home.component.ts (Line 118-149)
* [X] Paginated results - Implementation using material UI pagination set with a limit of 10 search results per page - Implementation in various places in home.component.ts and line 64 in home.component.html
* [X] Added limit and offset to improve search performance - Implementation in book.service.ts while making API calls
* [X] Clear search text - Implementation in home.component.ts on line 189 to 191
* [X] Table should have due_date(Optional Field with create and update,date should not be greater than the current timestamp)
* [X] Handle edge cases related to api calls (like when the link is undefined then there is no use to redirect user to the link) - Implementation in home.component.html from line 45-48 and also solved some edge cases like error handling in the home.component.ts file
* [X] Add Loaders on the page while fetching data for both the Trending Subjects redirected table view and the new Search result view - Added both while fetching data and in Trending Subjects.You will notice a "Loading...." text.
* [X] Add a Back button to Go back to the home page from the Trending Subject page-Added back button in Trending Subject Page.
* [X] Implement caching for the API responses - Implemented caching for the API responses - home.components.ts - Line 58 to 61

__Note__ - This challenge is in angular. We work on angular frameworks & after you join we expect the same from you. Hence it is required to complete this assignement in angular itself.

## Who is this for?

This challenge is meant for candidates who wish to intern at Fyle and work with our engineering team. The candidate should be able to commit to at least 6 months of dedicated time for internship.

## Why work at Fyle?

Fyle is a fast-growing Expense Management SaaS product. We are ~40 strong engineering team at the moment. 

We are an extremely transparent organization. Check out our [careers page](https://careers.fylehq.com) that will give you a glimpse of what it is like to work at Fyle. Also, check out our Glassdoor reviews [here](https://www.glassdoor.co.in/Reviews/Fyle-Reviews-E1723235.htm). You can read stories from our teammates [here](https://stories.fylehq.com).

## Challenge outline

This challenge involves implementing a Books Library using the Open Library Subjects and Search APIs . The challenge is described in detail [here](./Application.md)

__Note__ - This challenge is in angular. We work on angular frameworks & after you join we expect the same from you. Hence it is required to complete this assignement in angular itself.

## What happens next?

You will hear back within 48 hours from us via email.

## Installation

1. Fork this repository to your github account.
2. Clone the forked repository and proceed with steps mentioned below.

### Install requirements
* Install Nx using the [Nx Documentation](https://nx.dev)
* Install `nvm` for linux or mac from this [url](https://github.com/creationix/nvm#installation-and-update)
* Install `nvm` for windows from this [url](https://github.com/coreybutler/nvm-windows/releases)
* Check `nodejs` version by typing : `node -v`
* Install dependencies : `npm install --save-dev`

## Development server

Run `nx serve front-end-internship-assignment` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
Visit the [Angular Documentation](https://angular.io/guide/styleguide) to learn more.