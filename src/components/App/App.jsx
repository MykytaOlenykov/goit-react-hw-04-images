import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { GlobalStyle } from 'components/GlobalStyle';
import { Searchbar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { Container } from './App.styled';

export class App extends Component {
  state = {
    imgName: '',
  };

  shouldComponentUpdate(_, nextState) {
    const prevImgName = this.state.imgName;
    const nextImgName = nextState.imgName;

    if (prevImgName === nextImgName) {
      toast.info(
        `Request for ${nextImgName} already processed. Enter new value.`
      );
      return false;
    }

    return true;
  }

  handleSubmitForm = imgName => {
    this.setState({ imgName });
  };

  render() {
    const { imgName } = this.state;

    return (
      <Container>
        <GlobalStyle />
        <Searchbar onSubmit={this.handleSubmitForm} />
        <ImageGallery imgName={imgName} />
        <ToastContainer autoClose={5000} />
      </Container>
    );
  }
}
