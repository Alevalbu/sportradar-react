import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Scoreboard from './Scoreboard';

describe('Scoreboard Component', () => {
  const addMatch = async (homeTeam, awayTeam) => {
    const homeInput = screen.getByPlaceholderText('Home Team');
    const awayInput = screen.getByPlaceholderText('Away Team');
    const startButton = screen.getByRole('button', { name: /start match/i });

    await userEvent.type(homeInput, homeTeam);
    await userEvent.type(awayInput, awayTeam);
    fireEvent.click(startButton);
  };

  const updateScore = async (homeTeam, awayTeam, homeScore, awayScore) => {
    const matchElement = screen.getByText(homeTeam).closest('.border');
    const inputs = within(matchElement).getAllByRole('spinbutton');
    
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], homeScore.toString());
    await userEvent.clear(inputs[1]);
    await userEvent.type(inputs[1], awayScore.toString());
  };

  beforeEach(() => {
    render(<Scoreboard />);
  });

  test('renders the scoreboard header', () => {
    expect(screen.getByText('Live Football World Cup Scoreboard')).toBeInTheDocument();
  });

  test('shows "No matches in progress" when there are no matches', () => {
    expect(screen.getByText('No matches in progress')).toBeInTheDocument();
  });

  test('can add a new match', async () => {
    await addMatch('Mexico', 'Canada');
    
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  test('cannot add a match with empty team names', async () => {
    const startButton = screen.getByRole('button', { name: /start match/i });
    fireEvent.click(startButton);
    
    expect(screen.getByText('No matches in progress')).toBeInTheDocument();
  });

  test('can update match scores', async () => {
    await addMatch('Spain', 'Brazil');
    await updateScore('Spain', 'Brazil', '10', '2');

    const matchElement = screen.getByText('Spain').closest('.border');
    expect(within(matchElement).getByText('Total Score: 12')).toBeInTheDocument();
  });

  test('can finish (remove) a match', async () => {
    await addMatch('Germany', 'France');
    
    const finishButton = screen.getByTitle('Finish Match');
    fireEvent.click(finishButton);
    
    expect(screen.queryByText('Germany')).not.toBeInTheDocument();
    expect(screen.queryByText('France')).not.toBeInTheDocument();
  });

  test('sorts matches by total score and then by start time', async () => {
    // Add all matches with provided data
    await addMatch('Mexico', 'Canada');
    await updateScore('Mexico', 'Canada', '0', '5');
    
    await addMatch('Spain', 'Brazil');
    await updateScore('Spain', 'Brazil', '10', '2');
    
    await addMatch('Germany', 'France');
    await updateScore('Germany', 'France', '2', '2');
    
    await addMatch('Uruguay', 'Italy');
    await updateScore('Uruguay', 'Italy', '6', '6');
    
    await addMatch('Argentina', 'Australia');
    await updateScore('Argentina', 'Australia', '3', '1');

    // Get all match elements
    const matches = screen.getAllByText(/Total Score:/i);
    
    // Verify the order based on total scores
    expect(matches[0]).toHaveTextContent('Total Score: 12'); // Uruguay-Italy (12)
    expect(matches[1]).toHaveTextContent('Total Score: 12'); // Spain-Brazil (12)
    expect(matches[2]).toHaveTextContent('Total Score: 5');  // Mexico-Canada (5)
    expect(matches[3]).toHaveTextContent('Total Score: 4');  // Germany-France (4)
    expect(matches[4]).toHaveTextContent('Total Score: 4');  // Argentina-Australia (4)
  });

  test('resets new match form after adding a match', async () => {
    await addMatch('Argentina', 'Australia');
    
    const homeInput = screen.getByPlaceholderText('Home Team');
    const awayInput = screen.getByPlaceholderText('Away Team');
    
    expect(homeInput.value).toBe('');
    expect(awayInput.value).toBe('');
  });

  test('maintains individual match scores independently', async () => {
    await addMatch('Uruguay', 'Italy');
    await addMatch('Argentina', 'Australia');
    
    await updateScore('Uruguay', 'Italy', '6', '6');
    await updateScore('Argentina', 'Australia', '3', '1');

    const uruguayMatch = screen.getByText('Uruguay').closest('.border');
    const argentinaMatch = screen.getByText('Argentina').closest('.border');
    
    expect(within(uruguayMatch).getByText('Total Score: 12')).toBeInTheDocument();
    expect(within(argentinaMatch).getByText('Total Score: 4')).toBeInTheDocument();
  });
});