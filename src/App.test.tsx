import React from 'react';
import {fireEvent, render,} from '@testing-library/react';
import App, {formatCount} from './App';

describe('<App/>', () => {
    describe('render / component tests', () => {
        test('renders initial time count', () => {
            const {getByText} = render(<App />);
            const timerElement = getByText(/00:000/i);
            expect(timerElement).toBeInTheDocument();
        });

        it("should not add count when not started even if time lapse", () => {
            // given
            jest.useFakeTimers();
            const {getByText} = render(<App />);

            // when
            jest.advanceTimersByTime(1000);

            // then
            const timerElement = getByText(/00:000/i);
            expect(timerElement).toBeInTheDocument();
        });

        // TODO: fix `Warning: An update to Chronometer inside a test was not wrapped in act(...).`
        it('should add count to timer after clicked start', () => {
            // given
            jest.useFakeTimers();
            const {getByText} = render(<App />);
            fireEvent.click(getByText(/Start/i))

            // when
            jest.advanceTimersByTime(1000);

            // then
            expect(getByText(/01:000/i)).toBeInTheDocument();
        });

    });

    describe('formatCount', () => {
        [
            {count: 0, expected: "00:000"},
            {count: 1, expected: "00:001"},
            {count: 10, expected: "00:010"},
            {count: 11, expected: "00:011"},
            {count: 100, expected: "00:100"},
            {count: 999, expected: "00:999"},
            {count: 1000, expected: "01:000"},
            {count: 1999, expected: "01:999"},
            {count: 2000, expected: "02:000"},
            {count: 59999, expected: "59:999"},
        ].forEach(({count, expected}) =>
            it(`should formatCount from ${count} to ${expected}`, () => {
                // given
                // when
                const actual = formatCount(count);

                // then
                expect(actual).toEqual(expected);
            })
        );
    });
});