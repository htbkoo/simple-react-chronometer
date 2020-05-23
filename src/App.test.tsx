import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('<App/>', () => {
    describe('render / component tests', () => {
        test('renders initial time count', () => {
            const { getByText } = render(<App />);
            const linkElement = getByText(/00:00/i);
            expect(linkElement).toBeInTheDocument();
        });
    });
});