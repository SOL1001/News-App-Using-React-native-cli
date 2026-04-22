import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { SortToggle } from '../src/features/news/components/SortToggle';

describe('SortToggle', () => {
  it('invokes onChange with time when the Time tab is pressed', () => {
    const onChange = jest.fn();
    render(<SortToggle sortBy="score" onChange={onChange} />);

    fireEvent.press(screen.getByText('Time'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('time');
  });

  it('invokes onChange with score when the Score tab is pressed', () => {
    const onChange = jest.fn();
    render(<SortToggle sortBy="time" onChange={onChange} />);

    fireEvent.press(screen.getByText('Score'));

    expect(onChange).toHaveBeenCalledWith('score');
  });
});
