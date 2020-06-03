import React from 'react';
import {act, fireEvent, render} from '@testing-library/react';
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

        [
            {timeLapsed: 0, expectedText: /00:000/i},
            {timeLapsed: 9, expectedText: /00:000/i},
            {timeLapsed: 10, expectedText: /00:010/i},
            {timeLapsed: 100, expectedText: /00:100/i},
            {timeLapsed: 999, expectedText: /00:990/i},
            {timeLapsed: 1000, expectedText: /01:000/i},
        ].forEach(({timeLapsed, expectedText}) =>
            it(`should, if start button is clicked, display ${expectedText} after ${timeLapsed}ms`, async () => {
                // given
                jest.useFakeTimers();
                const {getByText} = render(<App />);
                fireEvent.click(getByText(/Start/i));

                // when
                await act(async () => await jest.advanceTimersByTime(timeLapsed));

                // then
                expect(getByText(expectedText)).toBeInTheDocument();
            })
        );
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