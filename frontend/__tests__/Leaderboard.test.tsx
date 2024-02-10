import React from 'react';
import { render,screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'
import {AuthProvider} from "../src/pages/AuthContext.tsx"
import Leaderboard from "../src/components/Leaderboard"


test('renders home component', ()=> {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { getByTestId } =  render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/api/v1/scores']}>
          <Leaderboard />
        </MemoryRouter>
      </AuthProvider>
    );
  
    const LBElement = screen.getByTestId('leaderboard');
    expect(LBElement).toBeInTheDocument();
  });

