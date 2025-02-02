import React from 'react';
import JobCard from '../JobCard';
import {test, expect, afterEach} from 'vitest';
import {render, cleanup} from '@testing-library/react';

afterEach(cleanup);

test('renders the JobCard component', () => {
    render(<JobCard id={1} title='Accommodation manager' salary='126000' equity={false} company='Mejia, Scott and Ryan' applied={true}/>);
});

test('matches the snapshot', () => {
    const jobcard = render(<JobCard id={1} title='Accommodation manager' salary='126000' equity={false} company='Mejia, Scott and Ryan' applied={true}/>);
    expect(jobcard).toMatchSnapshot();
});

test('displays correct content', () => {
    const {getByText} = render(<JobCard id={1} title='Accommodation manager' salary='126000' equity={false} company='Mejia, Scott and Ryan' applied={true}/>);
    expect(getByText('Applied')).toBeInTheDocument();
});