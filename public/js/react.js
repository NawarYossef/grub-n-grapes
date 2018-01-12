import React from 'react';

import SurpriseButton from './surprise-button';
import SurpriseImage from './surprise-image';

export default class Surprise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 'button'
        }
      // this.showImage = this.showImage.bind(this)
    }

    showImage() {
        this.setState({
            display: 'image'
        });
    }

    render() {
      const showImageBinding = () => this.showImage()
        if (this.state.display === 'button') {
            return <SurpriseButton meatballs={showImageBinding} />;
        }
        else if (this.state.display === 'image') {
            return <SurpriseImage />;
        }
    }
}
  

// ////////////////////
import React from 'react';

export default function SurpriseButton(props) {
    return <button onClick={props.meatballs}>Surprise!</button>;
}
