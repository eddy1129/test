import React from'react';
import H from '@here/maps-api-for-javascript';

export default class Map extends React.Component {
    constructor(props) {
      super(props);
      // the reference to the container
      this.ref = React.createRef();
      // reference to the map
      this.map = null;
    }
  
    componentDidMount() {
      if (!this.map) {
        // instantiate a platform, default layers and a map as usual
        const platform = new H.service.Platform({
          apikey: '6UV66GYV2IufHtzD3Nl_ivSroD16eckXKcSvITReRArYH6ODWWupapgGNOe7cXJtajrKO5lP2oh9hkLQA-P1qg'
        });
        const layers = platform.createDefaultLayers();
        const map = new H.Map(
          this.ref.current,
          layers.vector.normal.map,
          {
            pixelRatio: window.devicePixelRatio,
            center: {lat: 0, lng: 0},
            zoom: 2,
          },
        );
        this.map = map;
      }
    }
  
    render() {
      return (
        <div
          style={{ width: '1000px', height:'1000px' }}
          ref={this.ref}
        />
      )
    }
  }