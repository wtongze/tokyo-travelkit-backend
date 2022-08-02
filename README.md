# Tokyo TravelKit - Back End

This is the back end codebase for Tokyo TravelKit.


It also includes a C++ native module for routing purposes via node-addon-api.


Frontend Codebase:


<https://github.com/wtongze/tokyo-travelkit-frontend>

## Note 
> The code submitted to the organizer of 4th Open Data Challenge for Public Transportation in Tokyo is in the [`Releases`](https://github.com/wtongze/tokyo-travelkit-backend/releases) section.


## Set up
Please make sure you have Python and C++ compiler installed in your system.
I use C++2a spec.

```
npm install

# Set up api key
echo "API_KEY=<YOUR_API_KEY>" > .env

# Import all static data
npm run import

# Build railway graph for routing
npm run buildGraph

# Test api
npm run api
```
