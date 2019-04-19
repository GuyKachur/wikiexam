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

    this.addItem = this.addItem.bind(this);
    this.changeHistory = this.changeHistory.bind(this);

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
      this.props.match.params.phrase === undefined
    ) {
      console.log("Invalid props passed: ", this.props);
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
        links: res.links,
        categories: res.categories,
        text: res.text["*"],
        title: res.title
      });
      if (this.state.searchs.length !== 0) {
        let resultlist = [];
        for (let i = 0; i < this.state.searchs.length; i++) {
          resultlist.push(this.state.searchs[i]);
        }
        resultlist.push(suggestion);
        this.setState({ searchs: resultlist });
      } else {
        this.setState({ searchs: [suggestion] });
      }
      //display incoming results on page
      //  this.setState();
    });
  }

  addItem(item) {
    //{sortkey: "", hidden: "", *: "CS1_maint:_Untitled_periodical"}
    // console.log("ITEM:", item);
    console.log("ITEM:", item["*"]);
    if (this.state.searchs.length !== 0) {
      let resultlist = [];
      for (let i = 0; i < this.state.searchs.length; i++) {
        resultlist.push(this.state.searchs[i]);
      }
      resultlist.push(item["*"]);
      this.setState({ searchs: resultlist });
    } else {
      this.setState({ searchs: item["*"] });
    }
    Meteor.call("queryWikipedia", item["*"], (err, res) => {
      if (err) {
        alert("There was error check the console");
        console.log(err);
        return;
      }
      console.log("item clicked", res);
      this.setState({
        links: res.links,
        categories: res.categories,
        text: res.text["*"],
        title: res.title
      });

      //display incoming results on page
      //  this.setState();
    });
  }

  changeHistory(item) {
    console.log("history item", item);
    let resultlist = [];
    for (let i = this.state.searchs.length; i > 0; i--) {
      if (this.state.searchs[i] === item) {
        this.setState({ searchs: resultlist });
        Meteor.call("queryWikipedia", item, (err, res) => {
          if (err) {
            alert("There was error check the console");
            console.log(err);
            return;
          }
          console.log("item clicked", res);
          this.setState({
            links: res.links,
            categories: res.categories,
            text: res.text["*"],
            title: res.title
          });

          //display incoming results on page
          //  this.setState();
        });
        return;
      } else {
        //it doesnt match
        resultlist.push(this.state.searchs[i]);
      }
    }
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
    console.log("Links", this.state.links);
    const links =
      this.state.links.length === 0
        ? ""
        : this.state.links.map((item, index) => {
            return (
              <span key={index}>
                {" "}
                <a onClick={() => this.addItem(item)}>{item["*"]}</a>
                <br />
              </span>
            );
          });
    console.log("categories", this.state.categories);
    const categories =
      this.state.categories.length === 0
        ? ""
        : this.state.categories.map((item, index) => {
            return (
              <span key={index}>
                <a onClick={() => this.addItem(item)}>{item["*"]}</a>
                <br />
              </span>
            );
          });

    console.log("History", this.state.searchs);
    const history =
      this.state.searchs.length === 0
        ? ""
        : this.state.searchs.map((item, index) => {
            return (
              <span key={index}>
                <a onClick={() => this.changeHistory(item)}>{item}</a>
                <br />
              </span>
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
          <h1> Links </h1>
          {links}
          <h2> categories </h2>
          {categories}
          <h2> History </h2>
          {history}
          <h3> Wiki Content </h3>
          <span dangerouslySetInnerHTML={{ __html: this.state.text }} />
        </div>
      </div>
    );
  }
}
export default SearchBar;
