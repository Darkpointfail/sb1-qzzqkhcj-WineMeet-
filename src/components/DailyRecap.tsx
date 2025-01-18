import React from 'react';
import { ClipboardList, MapPin, Clock, Building2 } from 'lucide-react';
import { Meeting, SalesRep } from '../types';
import { format } from 'date-fns';

interface DailyRecapProps {
  meetings: Meeting[];
  salesReps: SalesRep[];
  selectedDate: Date;
}

export function DailyRecap({ meetings, salesReps, selectedDate }: DailyRecapProps) {
  const dailyMeetings = meetings.filter(
    meeting => format(new Date(meeting.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const getRandomProfileImage = () => {
    const images = [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200&h=200'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  return (
    <div className="space-y-4">
      {dailyMeetings.length === 0 ? (
        <p className="text-gray-500">No meetings scheduled for {format(selectedDate, 'MMMM d, yyyy')}</p>
      ) : (
        dailyMeetings.map(meeting => {
          const salesRep = salesReps.find(rep => rep.id === meeting.salesRepId);
          return (
            <div key={meeting.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <img
                  src={salesRep?.image_url || getRandomProfileImage()}
                  alt={salesRep?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                      <p className="text-sm text-gray-600">with {salesRep?.name}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {format(new Date(meeting.date), 'h:mm a')}
                    </div>
                  </div>
                  
                  {salesRep?.company && (
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-1" />
                      {salesRep.company}
                    </div>
                  )}
                  
                  {meeting.location && (
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {meeting.location}
                    </div>
                  )}
                  
                  {meeting.notes && (
                    <p className="mt-2 text-sm text-gray-600">{meeting.notes}</p>
                  )}
                  
                  {salesRep?.portfolio && salesRep.portfolio.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {salesRep.portfolio.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-wine-100 text-wine-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}