import React from 'react';
import { render,fireEvent,screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import {AuthProvider} from "../src/pages/AuthContext.tsx"
import Leaderboard from "../src/components/Leaderboard"


test('renders home component', ()=> {

    const { getByText,getByTestId } =  render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/api/v1/scores']}>
          <Leaderboard />
        </MemoryRouter>
      </AuthProvider>
    );
  
    const LBElement = screen.getByTestId('leaderboard');
    expect(LBElement).toBeInTheDocument();
  });

