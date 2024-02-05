import React from 'react';
import { render,fireEvent,screen,waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {AuthProvider} from "../src/pages/AuthContext.tsx"
import '@testing-library/jest-dom'
import Game from '../src/components/Game';
import Navbar from '../src/components/Navbar';


const game = {
  _id: '65b804372f6941ce2cb099ef',
  gameName: 'Example Game',
  picture: 'example.jpg',
  characters: [
    { name: 'name', coords: [1, 2, 3] },
    { name: 'nameee', coords: [3, 4, 5] },
  ],
};


test('renders game component', ()=> {

  const { getByText,getByTestId } =  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{state: { game } }]}>
        <Game />
      </MemoryRouter>
    </AuthProvider>
  );

  const gameElement = screen.getByTestId('game');
  expect(gameElement).toBeInTheDocument();
});


test('clicking on a specific map area triggers the modal to open', () => {
  const { queryByTestId,getByTestId } = render(
    <AuthProvider>
    <MemoryRouter initialEntries={[{state: { game } }]}>
      <Game />
    </MemoryRouter>
  </AuthProvider>
    );

  const mapArea = getByTestId(`map-area-${game.characters[0].name}`); 
  fireEvent.click(mapArea);

  const modalContent = queryByTestId('modal-content');
  expect(modalContent).toBeInTheDocument();
});

test('modal does not open if user does not click on map area', () => {
  const { getByTestId, queryByTestId } = render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ state: { game } }]}>
        <Game />
      </MemoryRouter>
    </AuthProvider>
  );

  // Assert that the modal content is not present initially
  const modalContentBeforeClick = queryByTestId('modal-content');
  expect(modalContentBeforeClick).not.toBeInTheDocument();

  render(<div data-testid="some-non-map-element">This is a non-map element</div>);
  // Click on some other element (not a map area)
  const nonMapElement = screen.getByTestId('some-non-map-element'); // replace with your actual non-map element
  fireEvent.click(nonMapElement);

  // Assert that the modal content is still not present
  const modalContentAfterClick = queryByTestId('modal-content');
  expect(modalContentAfterClick).not.toBeInTheDocument();
});

test('modal does not initially appear', () => {
  const { queryByTestId } = render(
    <AuthProvider>
    <MemoryRouter initialEntries={[{state: { game } }]}>
      <Game />
    </MemoryRouter>
  </AuthProvider>
  );
  
  const modalContent = queryByTestId('modal-content');
  expect(modalContent).not.toBeInTheDocument();

});
  
test('modal appears when clicking on map area', () => {
  const { getByTestId } = render(
    <AuthProvider>
    <MemoryRouter initialEntries={[{state: { game } }]}>
      <Game />
    </MemoryRouter>
  </AuthProvider>
    );
  
  const image = getByTestId('game-image');
  fireEvent.click(image);
  
  const modalContent = getByTestId('modal-content');
  expect(modalContent).toBeInTheDocument();

});
  

test('modal disappears when clicking outside', () => {
  const { getByTestId, queryByTestId } = render(
    <AuthProvider>
    <MemoryRouter initialEntries={[{state: { game } }]}>
      <Game />
    </MemoryRouter>
  </AuthProvider>
    );
    
  const image = getByTestId('game-image');
  fireEvent.click(image);
  
  const modalContent = getByTestId('modal-content');
  expect(modalContent).toBeInTheDocument();
  
  const outsideElement = document.createElement('div');
  document.body.appendChild(outsideElement);
  fireEvent.click(outsideElement);
  document.body.removeChild(outsideElement);
    
  const modalContentAfterClick = queryByTestId('modal-content');
  expect(modalContentAfterClick).not.toBeInTheDocument();

});


test('modal does not have character after guessing the right character', () => {
  const { getByTestId, queryByTestId } = render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ state: { game } }]}>
        <Game />
      </MemoryRouter>
    </AuthProvider>
  );

  // Click on the map area to guess the right character
  const mapArea = getByTestId(`map-area-${game.characters[0].name}`); // Replace 'name' with the actual character name
  fireEvent.click(mapArea);
  const modalArea = getByTestId(`modal-area-${game.characters[0].name}`)
  fireEvent.click(modalArea);
  // Assert that the modal has one less character
  fireEvent.click(mapArea);
  expect(modalArea).not.toBeInTheDocument();
});


test('modal retains the characters in modal if user guessed the wrong character', () => {
  const { getByTestId } = render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ state: { game } }]}>
        <Game />
      </MemoryRouter>
    </AuthProvider>
  );

  const character = getByTestId(`map-area-${game.characters[0].name}`);
  fireEvent.click(character);

  const wrongCharModal = getByTestId(`modal-area-${game.characters[1].name}`);
  fireEvent.click(wrongCharModal);

  fireEvent.click(character);

  const rightCharModal = getByTestId(`modal-area-${game.characters[0].name}`);
  const wrongCharModalAfterSecondClick = getByTestId(`modal-area-${game.characters[1].name}`);

  expect(rightCharModal).toBeInTheDocument();
  expect(wrongCharModalAfterSecondClick).toBeInTheDocument();
});

test('win modal is displayed after guessing all characters', async () => {
  const { getByTestId } = render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ state: { game } }]}>
        <Game />
      </MemoryRouter>
    </AuthProvider>
  );

  // Click on all map areas to guess all characters
  game.characters.forEach((character) => {
    const mapArea = getByTestId(`map-area-${character.name}`);
    fireEvent.click(mapArea);
    const modalArea = getByTestId(`modal-area-${character.name}`)
    fireEvent.click(modalArea);
  });
  
  await waitFor(() => {
    const winModal = getByTestId('winner-content');
    expect(winModal).toBeInTheDocument();
  });
});


