import React from 'react';
import { render,fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import App from '../src/App';


test('renders Home component for /api/v1 route as well as navbar', () => {
  const {getByTestId } = render(
    <MemoryRouter initialEntries={['/api/v1']}>
      <App />
    </MemoryRouter>
  );

  const homeElement = getByTestId('home')
  expect(homeElement).toBeInTheDocument();

  const navbarElement = getByTestId('navbar');
  expect(navbarElement).toBeInTheDocument();
});

test('renders Game component for /api/v1/game/:id route as well as navbar', () => {
  const { getByText,getByTestId } = render(
    <MemoryRouter initialEntries={['/api/v1/game/123']}>
      <App />
    </MemoryRouter>
  );

  fireEvent.click(getByText(/Game/i));
  const gameElement = getByText(/Game/i);
  expect(gameElement).toBeInTheDocument();

  const navbarElement = getByTestId('navbar');
  expect(navbarElement).toBeInTheDocument();

});

test('renders Navbar component in the routes', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const navbarElement = getByTestId('navbar');
    expect(navbarElement).toBeInTheDocument();
});
  
test('phototag link returns to homepage + nav', () => {

    const { getByText,getByTestId } = render(
        <MemoryRouter initialEntries={['/']}>
            <App />
        </MemoryRouter>
    );
    
    const homelink = getByText('PhotoTag');
    fireEvent.click(homelink); // Simulate clicking the Phototag link

    const navbarElement = getByTestId('navbar');
    expect(navbarElement).toBeInTheDocument();
    const homeElement = getByTestId('home')
    expect(homeElement).toBeInTheDocument();
});