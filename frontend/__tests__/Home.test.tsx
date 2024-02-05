import React from 'react';
import { render,fireEvent,screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {AuthProvider} from "../src/pages/AuthContext.tsx"
import '@testing-library/jest-dom'
import Home from '../src/components/Home'

test('renders home component', ()=> {

    const { getByText,getByTestId,container } =  render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/api/v1']}>
          <Home />
        </MemoryRouter>
      </AuthProvider>
    );
  
    const homeElement = screen.getByTestId('home');
    expect(homeElement).toBeInTheDocument();
    console.log(container.innerHTML);
  });
  