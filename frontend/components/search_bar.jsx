const React          = require('react');
const GroupActions   = require('../actions/group_actions');
const GroupStore     = require('../stores/group_store');

const SearchBar = React.createClass({
  getInitialState() {
    return({
      distance    : 5,
      location    : "",
      lat         : "",
      lng         : "",
      titleSearch : "",
    });
  },

  componentDidMount() {
    this.getLocation();
    this._isMounted = true;
  },
  componentWillUnmount() {
    this._isMounted = false;
  },
  getLocation() {
    this.loading = (<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>);
    const sendString = string => {
      this.loading = "";
      if (this._isMounted) {
        this.setState({ location : string });
      }
    };
    const setLatLng = (lat, lng) => {
      if (this._isMounted) {
        this.setState({
          lat : lat,
          lng : lng
        });
      }
    };
    const sendZip = zip => {
      let locationString = "";
      $.ajax({
        url    : `http://ziptasticapi.com/${zip}`,
        method : "GET",
        success(dat) {
          dat               = JSON.parse(dat);
          locationString   += dat.city.toLowerCase();
          locationString    = locationString.split(" ");
          for (let i = 0; i < locationString.length; i++) {
            let splitWord     = locationString[i].split("");
            splitWord[0]      = splitWord[0].toUpperCase();
            locationString[i] = splitWord.join("");
          }
          locationString    = locationString.join(" ");
          locationString   += ", ";
          locationString   += dat.state;
          sendString(locationString);
        }
      });
    };
    $.ajax({
      url    : 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC7mHejYETsrCCXPm_ncRFkfAVxuAOS7yM',
      method : 'POST',
      success(dat) {
        let lat        = dat.location.lat;
        let lng        = dat.location.lng;
        $.ajax({
          url    : `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC7mHejYETsrCCXPm_ncRFkfAVxuAOS7yM`,
          method : "GET",
          success(data) {
            let zip               = "";
            let addressComponents = data.results[0].address_components;
            for (let prop in addressComponents) {
              if (addressComponents.hasOwnProperty(prop)) {
                if (addressComponents[prop].types[0] === "postal_code") {
                  zip = addressComponents[prop].long_name;
                }
              }
            }
            setLatLng(lat, lng);
            sendZip(zip);
          }
        });
      }
    });
  },
  _chooseDistance(e) {
    e.preventDefault();
    jQuery.each(jQuery('.distance ul li'),function (index) {
      jQuery(jQuery('.distance ul li')[index]).removeClass('selected');
    });
    jQuery(e.currentTarget).addClass('selected');
    this.setState({ distance: jQuery(e.currentTarget).children().text() });
  },
  _chooseLocation(e) {
    if (e.key === "Enter") {
      const locationText = e.currentTarget.value;
      let lat, lng;
      $.ajax({
        url    : `https://maps.googleapis.com/maps/api/geocode/json?address=${e.currentTarget.value}&region=us&key=AIzaSyC7mHejYETsrCCXPm_ncRFkfAVxuAOS7yM`,
        method : "GET",
        success(dat) {
          lat = dat.results[0].geometry.location.lat;
          lng = dat.results[0].geometry.location.lng;
          setTheState(lat, lng, locationText);
        }
      });

      const setTheState = (lat, lng, locationText) => {
        if (this._isMounted) {
          this.setState({
            location : locationText,
            lat      : lat,
            lng      : lng
          });
        }
      };
      jQuery('.choose.location').addClass('hide');
    }
  },
  _updateLocationValue(e) {
    this.setState({ location : e.currentTarget.value });
  },
  _locationClick(e) {
    const target = e.currentTarget;
    const setTheState = (lat, lng, locationText) => {
      if (this._isMounted) {
        this.setState({
          location : locationText,
          lat      : lat,
          lng      : lng
        });
      }
    };
    jQuery(document).on('click', clickEv => {
      const locationText = target.value;
      if (jQuery(clickEv.target).is('.choose.location input') === false) {
        let lat, lng;
        $.ajax({
          url    : `https://maps.googleapis.com/maps/api/geocode/json?address=${locationText}&region=us&key=AIzaSyC7mHejYETsrCCXPm_ncRFkfAVxuAOS7yM`,
          method : "GET",
          success(dat) {
            lat = dat.results[0].geometry.location.lat;
            lng = dat.results[0].geometry.location.lng;
            setTheState(lat, lng, locationText);
          }
        });
        jQuery('.choose.location').addClass('hide');
        jQuery(document).off('click');
      }
    });
  },
  _revealLocationMenu(e) {
    e.preventDefault();
    jQuery('.choose.location').removeClass('hide');
    jQuery(document).on('click', function(ev) {
      if (jQuery(ev.target).is('.choose.location input') === false) {
        jQuery('.choose.location').addClass('hide');
      }
      if (jQuery(ev.target).is('.click-to-choose-location') === true) {
        jQuery('.choose.location').removeClass('hide');
      }
    });
  },
  _revealDistanceMenu(e) {
    e.preventDefault();
    jQuery('.choose.distance').removeClass('hide');
    jQuery(document).on('click', function(ev) {
      if (jQuery(ev.target).is('.click-to-choose-distance') === false) {
        jQuery('.choose.distance').addClass('hide');
      }
    });

  },
  _filterGroups(e) {
    e.preventDefault();
    GroupActions.filterGroups(this.state.lat, this.state.lng, this.state.distance, this.state.titleSearch);
  },
  _titleSearch(e) {
    this.setState({ titleSearch : e.currentTarget.value });
  },
  _isEnter(e) {
    if (e.key === 'Enter') {
      this._filterGroups(e);
    }
  },
  render() {
    let miles = "miles";
    if (this.state.distance === 'any distance') {
      miles = "";
    }
    return(
      <div className="search-bar">
        <i className="fa fa-search" onClick={this._filterGroups}></i>
        <input placeholder="All Meetups" defaultValue={this.state.titleSearch} onChange={this._titleSearch} onKeyUp={this._isEnter} className="meetup-search" />
        within <span className="click-to-choose-distance" onClick={this._revealDistanceMenu}>
        {this.state.distance} {miles}</span> of {this.loading}
        <span className="click-to-choose-location" onClick={this._revealLocationMenu}>
          {this.state.location}
        </span>
        <div className="choose distance hide">
          <ul>
            <li onClick={this._chooseDistance}><span>2</span> miles</li>
            <li onClick={this._chooseDistance}><span>5</span> miles</li>
            <li onClick={this._chooseDistance}><span>10</span> miles</li>
            <li onClick={this._chooseDistance}><span>25</span> miles</li>
            <li onClick={this._chooseDistance}><span>50</span> miles</li>
            <li onClick={this._chooseDistance}><span>100</span> miles</li>
            <li onClick={this._chooseDistance}><span>any distance</span></li>
          </ul>
        </div>
        <div className="choose location hide">
          <input defaultValue={this.state.location} placeholder="City or Postal Code" onKeyUp={this._chooseLocation} onClick={this._locationClick} />
        </div>
      </div>
    );
  }
});

module.exports = SearchBar;
