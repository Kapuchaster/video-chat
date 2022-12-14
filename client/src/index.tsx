import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import userId from "./services/auth";

import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { WithModalContext } from "./HOC/WithModal";
import { WithSettingsContext } from "./HOC/WithSettings";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const httpLink = new HttpLink({
  uri: `http://${process.env.REACT_APP_IP}/`,
  headers: { "user-id": userId },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${process.env.REACT_APP_IP}/graphql`,
    connectionParams: {
      headers: {
        authorization: { userId },
      },
    },
  })
);

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  uri: `http://${process.env.REACT_APP_IP}`,
  link: splitLink,
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <WithSettingsContext>
        <ChakraProvider>
          <WithModalContext>
            <App />
          </WithModalContext>
        </ChakraProvider>
      </WithSettingsContext>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
