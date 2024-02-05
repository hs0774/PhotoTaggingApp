import React from 'react';
import { render,fireEvent,screen,waitFor} from '@testing-library/react';
import { MemoryRouter,Route,Routes } from 'react-router-dom';
import '@testing-library/jest-dom'
import App from '../src/App';
import Game from '../src/components/Game'
import {AuthProvider} from "../src/pages/AuthContext.tsx"
import testimg from "../public/images/spotTheChick.jpg"

test('renders HOME component for /api/v1 route as well as NAVBAR and FOOTER', () => {
  const { getByTestId } = render(
    <AuthProvider>
    <MemoryRouter initialEntries={['/api/v1']}>
        <App />
    </MemoryRouter>
    </AuthProvider>
  );

  const homeElement = getByTestId('home');
  expect(homeElement).toBeInTheDocument();

  const navbarElement = getByTestId('navbar');
  expect(navbarElement).toBeInTheDocument();
  const footerElement = getByTestId('footer')
  expect(footerElement).toBeInTheDocument();

});

test('renders LEADERBOARD component for /api/v1 route as well as NAVBAR and FOOTER', () => {
  const { getByTestId } = render(
    <AuthProvider>
    <MemoryRouter initialEntries={['/api/v1/scores']}>
        <App />
    </MemoryRouter>
    </AuthProvider>
  );

  const homeElement = getByTestId('leaderboard');
  expect(homeElement).toBeInTheDocument();

  const navbarElement = getByTestId('navbar');
  expect(navbarElement).toBeInTheDocument();
  const footerElement = getByTestId('footer')
  expect(footerElement).toBeInTheDocument();
});


test('renders NAVBAR component in the routes', () => {
    const { getByTestId } = render(
      <AuthProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
      </AuthProvider>
    );
    const navbarElement = getByTestId('navbar');
    expect(navbarElement).toBeInTheDocument();
});

test('renders FOOTER component in the routes', () => {
  const { getByTestId } = render(
    <AuthProvider>
    <MemoryRouter>
      <App />
    </MemoryRouter>
    </AuthProvider>
  );
  const footerElement = getByTestId('footer');
  expect(footerElement).toBeInTheDocument();
});
  
test('phototag link returns to HOME + NAV + FOOTER', () => {

    const { getByText,getByTestId } = render(
        <AuthProvider>
        <MemoryRouter initialEntries={['/api/v1']}>
            <App />
        </MemoryRouter>
        </AuthProvider>
    );
    
    const homelink = getByText('PhotoTag');
    fireEvent.click(homelink); // Simulate clicking the Phototag link

    const navbarElement = getByTestId('navbar');
    expect(navbarElement).toBeInTheDocument();

    const homeElement = getByTestId('home')
    expect(homeElement).toBeInTheDocument();

    const footerElement = getByTestId('footer')
    expect(footerElement).toBeInTheDocument();    
});

const game = {
  _id: '65b804372f6941ce2cb099ef',
  gameName: 'Example Game',
  picture: 'example.jpg',
  characters: [
    { name: 'name', coords: [1, 2, 3] },
    { name: 'nameee', coords: [3, 4, 5] },
  ],
};

test('renders GAME component with NAVBAR and FOOTER and TIMER STARTED', async () => {
  const { getByText,getByTestId } = render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ pathname: '/api/v1/game/65b804372f6941ce2cb099ef', state: { game } }]}>
        <App/>
      </MemoryRouter>
    </AuthProvider>
);

  // Ensure that the Game component is rendered with nav and footer 
  const gameElement = screen.getByTestId('game');
  expect(gameElement).toBeInTheDocument();

  const navbarElement = getByTestId('navbar');
  expect(navbarElement).toBeInTheDocument();

  const footerElement = getByTestId('footer')
  expect(footerElement).toBeInTheDocument();
  
  await waitFor(() => {
    const timerElement = getByTestId('timer');
    expect(timerElement).toBeInTheDocument();
  });

});