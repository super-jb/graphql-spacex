# Graphql with SpaceX API

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.4.

## Steps

1. Generate a new angular application with routing

   ```bash
   ng new graphql-spacex --routing=true --style=scss
   ```

   Make sure to delete the default template in `src/app/app.component.html`

1. Install the [Apollo VS Code plugin](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo) and in the root of the project add `apollo.config.js`

   ```javascript
   module.exports = {
     client: {
       service: {
         name: 'angular-spacex-graphql-codegen',
         url: 'https://api.spacex.land/graphql/'
       }
     }
   };
   ```

   This points the extension at the SpaceX GraphQL API so we get autocomplete, type information, and other cool features in GraphQL files. You may need to restart VS Code.

1. Generate our two components:

   ```bash
   ng g component launch-list --changeDetection=OnPush
   ```
   ```bash
   ng g component launch-details --changeDetection=OnPush
   ```

   Because our generated services use observables we choose OnPush change detection for the best performance.

1. In `src/app/app-routing.module.ts` we setup the routing:

   ```typescript
   import { LaunchListComponent } from './launch-list/launch-list.component';
   import { LaunchDetailsComponent } from './launch-details/launch-details.component';

   const routes: Routes = [
     {
       path: '',
       component: LaunchListComponent
     },
     {
       path: ':id',
       component: LaunchDetailsComponent
     }
   ];
   ```

1. Each component will have its own data requirements so we co-locate our graphql query files next to them

   ```graphql
   # launch-list.graphql

   query pastLaunchesList($limit: Int!) {
     launchesPast(limit: $limit) {
       id
       mission_name
       links {
         flickr_images
         mission_patch_small
       }
       rocket {
         rocket_name
       }
       launch_date_utc
     }
   }
   ```

   ```graphql
   # launch-details.graphql

   query launchDetails($id: ID!) {
     launch(id: $id) {
       id
       mission_name
       details
       links {
         flickr_images
         mission_patch
       }
     }
   }
   ```

   Note the first line: `query launchDetails($id: ID!)` When we generate the Angular service the query name is turned into PascalCase and GQL is appended to the end, so the service name for the launch details would be LaunchDetailsGQL. Also in the first line we define any variables we'll need to pass into the query. Please note it's import to include id in the query return so apollo can cache the data.

1. We add [Apollo Angular](https://www.apollographql.com/docs/angular/) to our app with `ng add apollo-angular`. In `src/app/graphql.module.ts` we set our API url `const uri = 'https://api.spacex.land/graphql/';`.

1. Install Graphql Code Generator and the needed plugins `npm i --save-dev @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-apollo-angular @graphql-codegen/typescript-operations`

1. In the root of the project create a `codegen.yml` file:

   ```yml
   # Where to get schema data
   schema:
     - https://api.spacex.land/graphql/
   # The client side queries to turn into services
   documents:
     - src/**/*.graphql
   # Where to output the services and the list of plugins
   generates:
     ./src/app/services/spacexGraphql.service.ts:
       plugins:
         - typescript
         - typescript-operations
         - typescript-apollo-angular
   ```

1. In package.json add a script `"codegen": "gql-gen"` then `npm run codegen` to generate the Angular Services. At any time, if you make changes to the .graphql files created earlier, run this step again.

1. To make it look nice we add Angular Material `ng add @angular/material` then in the `app.module.ts` we import the card module and add to the imports array: `import { MatCardModule } from '@angular/material/card';`

1. Check the .ts, .html and .scss files for Launch-List and Launch-Details

1. `npm start`, navigate to `http://localhost:4200/`, and it should work!

