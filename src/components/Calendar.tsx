import React from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Meeting } from '../types';

interface CalendarProps {
  meetings: Meeting[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export function Calendar({ meetings, onDateSelect, selectedDate }: CalendarProps) {
  const meetingDays = meetings.map(meeting => new Date(meeting.date));

  return (
    <div className="w-full">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        modifiers={{
          meeting: meetingDays
        }}
        modifiersStyles={{
          meeting: {
            fontWeight: 'bold',
            color: '#8b5465'
          }
        }}
        className="custom-calendar mx-auto w-full"
        styles={{
          root: { width: '100%' },
          months: { width: '100%' },
          month: { width: '100%' },
          table: { width: '100%' },
          head_cell: { width: '14.28%' },
          cell: { width: '14.28%' }
        }}
      />
    </div>
  );
}