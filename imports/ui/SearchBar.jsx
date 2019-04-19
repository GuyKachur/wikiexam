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
      searchs: [],
      links: [],
      links: [],
      categories: [],
      text: "",
      title: ""
    };
  }

  componentDidMount() {
    console.log("Componenet did mount", this.props.match.params.phrase);
    if (
      this.props.match.params.phrase === "" ||
      this.props.match.params.phrase === null ||
      this.props.match.params.phrase === undefined ||
      typeof this.props.match.params.pharse !== "string"
    ) {
      console.log("no Props passed in");
    } else {
      Meteor.call(
        "queryWikipedia",
        this.props.match.params.phrase,
        (err, res) => {
          if (err) {
            alert("There was error check the console");
            console.log(err);
            return;
          }
          console.log("suggestion selected", res);
          this.setState({
            links: res.externallinks,
            categories: res.categories,
            text: res.text["*"],
            title: res.title
          });
          //display incoming results on page
          //  this.setState();
        }
      );
    }
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
    //this.setState({ history: this.state.history.push(suggestion) });
    Meteor.call("queryWikipedia", suggestion, (err, res) => {
      if (err) {
        alert("There was error check the console");
        console.log(err);
        return;
      }
      console.log("suggestion selected", res);
      this.setState({
        links: res.externallinks,
        categories: res.categories,
        text: res.text["*"],
        title: res.title
      });
      //display incoming results on page
      //  this.setState();
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
    //  console.log("Links", this.state.links);
    const links =
      this.state.links.length === 0
        ? ""
        : this.state.links.map((item, index) => {
            return (
              <a key={index} href={item}>
                {item}
              </a>
            );
          });
    //console.log("categories", this.state.categories);
    const categories =
      this.state.categories.length === 0
        ? ""
        : this.state.categories.map((item, index) => {
            return (
              <a key={index} href={item}>
                {item["*"]}
                <br />
              </a>
            );
          });

    return (
      <div>
        <h1>Jankapedia</h1>
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
          <span dangerouslySetInnerHTML={{ __html: this.state.text }} />
          <h1> Links </h1>
          {links}
          <h2> categories </h2>
          {categories}
        </div>
      </div>
    );
  }
}
export default SearchBar;
