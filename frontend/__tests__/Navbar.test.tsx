import React from 'react';
import { render,fireEvent,screen,act,waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {AuthProvider,useAuth} from "../src/pages/AuthContext.tsx"
import userEvent from '@testing-library/user-event';
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

