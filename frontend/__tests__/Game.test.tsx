import React from 'react';
import { render,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import Game from '../src/components/Game';
import Navbar from '../src/components/Navbar';

test('renders game', ()=> {
    render(<Game/>)
})

test('clicking on a specific map area triggers a specific action', () => {
    const { getByTestId } = render(<Game />);
  
    const mapArea = getByTestId('map-area-Tigger'); 
    fireEvent.click(mapArea);
});

test('modal does not initially appear', () => {
    const { queryByTestId } = render(<Game />);
  
    const modalContent = queryByTestId('modal-content');
    expect(modalContent).not.toBeInTheDocument();
  });
  
test('modal appears when clicking on map area', () => {
    const { getByTestId } = render(<Game />);
  
    const image = getByTestId('game-image');
    fireEvent.click(image);
  
    const modalContent = getByTestId('modal-content');
    expect(modalContent).toBeInTheDocument();
  });
  

  test('modal disappears when clicking outside', () => {
    const { getByTestId, queryByTestId } = render(<Game />);
    
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
  