import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom'
import Footer from '../src/components/Footer';


test('renders Footer component without crashing', () => {
    render(<Footer />);
});
  
test('renders Footer with GitHub image', () => {
    const { getByTestId } = render(<Footer />);
    const footerImage = getByTestId('footer-img');
    
    const expectedSrc = '/public/images/logos/github-mark-white.png';
    
    expect(footerImage).toHaveAttribute('src', expectedSrc);
});  