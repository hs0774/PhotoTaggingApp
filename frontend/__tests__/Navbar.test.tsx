import React from 'react';
import { render} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {AuthProvider} from "../src/pages/AuthContext.tsx"
import '@testing-library/jest-dom'
import Navbar from '../src/components/Navbar';


test('renders Navbar component with two svgs', () => {
    const { getByTestId,getByText } = render(
      <AuthProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    );
    const navbarElement = getByTestId('navbar');
    expect(navbarElement).toBeInTheDocument();
    
    const linkElement = getByText('PhotoTag');
    const svg = getByTestId('svg');
    const svg2 = getByTestId('svg2');
    expect(linkElement).toBeInTheDocument();
    expect(svg).toBeInTheDocument();
    expect(svg2).toBeInTheDocument();

});

