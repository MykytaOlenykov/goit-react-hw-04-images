import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { GlobalStyle } from 'components/GlobalStyle';
import { Searchbar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { Container } from './App.styled';

export class App extends Component {
  state = {
    imgName: '',
  };

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
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}
