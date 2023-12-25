import React from 'react';
import { render,fireEvent,screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import Navbar from '../src/components/Navbar';


test('renders Navbar component', () => {
    const { getByTestId,getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const navbarElement = getByTestId('navbar');
    expect(navbarElement).toBeInTheDocument();

    const linkElement = getByText('PhotoTag');
    expect(linkElement).toBeInTheDocument();

});

//Conditonal rendering test coming soon 
