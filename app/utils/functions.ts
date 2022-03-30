import { useMemo } from 'react';
import { Option } from './types';

export function getDate(date: Date) {
  const created = new Date(date);
  const day = created.getDate();
  const month = created.getMonth();
  const year = created.getFullYear();
  return month + 1 + '/' + day + '/' + year;
}

export function sumVotes(options: Option[]) {
  return options.reduce((sum, option) => sum + option.votes, 0);
}

export function getPercent(votes: number, totalVotes: number) {
  const percent = Math.round((votes / totalVotes) * 100);
  if (isNaN(percent)) {
    return 0;
  } else {
    return percent;
  }
}
