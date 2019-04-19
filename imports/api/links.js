import { Mongo } from "meteor/mongo";
import { HTTP } from "meteor/http";

export default (History = new Mongo.Collection("history"));

Meteor.methods({
  queryWikipedia(searchTerm) {
    if (Meteor.isServer) {
      import wikipedia from "node-wikipedia";
      //check(searchTerm, String);
      this.unblock();

      try {
        return new Promise((resolve, reject) => {
          wikipedia.page.data(searchTerm, { content: true }, resolve);
        });
      } catch (e) {
        // Got a network error, timeout, or HTTP error in the 400 or 500 range.
        console.log("Error fetching data for: ", searchTerm);
      }
    }
  }
});

Meteor.methods({
  "query.autocomplete"(suggestionQuery) {
    console.log("AUTOCOMPLETE", suggestionQuery);
    if (Meteor.isServer) {
      try {
        const params = {
          action: "opensearch",
          format: "json",
          search: suggestionQuery
        };
        let response = HTTP.call("GET", "http://en.wikipedia.org/w/api.php?", {
          params: params
        });
        console.log("response ", response.content);
        //console.log("RESPONSE CONETENT 1:", response.content[1]);
        let jsonparse = JSON.parse(response.content);
        console.log("JSON PARSE", jsonparse);
        return jsonparse[1];
      } catch (e) {
        console.log("autocomplete error" + e);
      }
    }
  }
});
