import React, { Component } from "react";
import { debounce } from "throttle-debounce";
import Autosuggest from "react-autosuggest";
import { Meteor } from "meteor/meteor";

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
  <div className="text-lg p-4">{suggestion}</div>
);

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
      this
    );
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this
    );
    this.onChange = this.onChange.bind(this);
    this.debouncedGetSuggestions = debounce(500, this.getSuggestions);

    this.state = {
      value: "",
      suggestions: [],
      history: [],
      links: []
    };
  }

  getSuggestions(value) {
    console.log("GETSUGGESTIONS", value);
    Meteor.call("query.autocomplete", value, (err, res) => {
      if (err) {
        alert("There was error check the console");
        console.log(err);
        return;
      }

      console.log("getsuggestions", res);
      if (res.length === 0) {
        res = ["Not Found, try another term"];
      }
      this.setState({ suggestions: res });
    });
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
  }

  onSuggestionsFetchRequested({ value }) {
    this.debouncedGetSuggestions(value);
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: ["Not found, try another term"]
    });
  }

  onSuggestionSelected(_event, { suggestion }) {
    console.log("On suggestion selected", suggestion);
    this.setState({ history: this.state.history.push(suggestion) });
    Meteor.call("queryWikipedia", suggestion.name, (err, res) => {
      if (err) {
        alert("There was error check the console");
        console.log(err);
        return;
      }
      console.log("suggestion selected", res);
      //display incoming results on page
    });
  }

  render() {
    const { value } = this.state;

    const inputProps = {
      placeholder: "Type a searchterm for wikipedia",
      value,
      onChange: this.onChange,
      id: "searchBar",
      className:
        "shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline mb-4"
    };

    return (
      <div>
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.onSuggestionSelected}
        />
        <div>
          {" "}
          <h1> Links </h1>
        </div>
        {this.state.history.map(e => {
          return <p> e </p>;
        })}
      </div>
    );
  }
}
export default SearchBar;
