import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DrillsPage from '../../app/(routes)/drills/page';
import { useDrillStore } from '@/state/drillStore';

describe('drill session smoke test', () => {
  it('runs count and decision drill interactions', async () => {
    const user = userEvent.setup();
    act(() => {
      useDrillStore.getState().start('mixed');
    });
    render(<DrillsPage />);

    const nextButtons = await screen.findAllByText(/Next card/i);
    await user.click(nextButtons[0]);
    const submitButton = await screen.findByText(/Submit/i);
    await user.click(submitButton);

    const scoreText = await screen.findAllByText(/Score:/i);
    expect(scoreText.length).toBeGreaterThan(0);
  });
});
