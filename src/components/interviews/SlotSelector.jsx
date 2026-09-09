import React, { useState } from 'react';
import Button from '../common/Button';
import { Calendar, Clock, CheckCircle2, Video } from 'lucide-react';

const SlotSelector = ({ slots = [], onConfirmSlot, isSubmitting = false }) => {
  const [selectedSlotId, setSelectedSlotId] = useState(slots[0]?.id || null);

  const selectedSlot = slots.find(s => s.id === selectedSlotId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 font-bold">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-navy-900">Select Interview Slot</h4>
          <p className="text-xs text-slate-500">Choose a convenient date & time for your interview round</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {slots.length > 0 ? (
          slots.map((slot) => {
            const isSelected = slot.id === selectedSlotId;
            return (
              <div
                key={slot.id}
                onClick={() => setSelectedSlotId(slot.id)}
                className={`
                  p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 select-none
                  ${isSelected
                    ? 'bg-gradient-to-br from-navy-900 to-navy-800 text-white border-teal-500 shadow-md ring-2 ring-teal-400'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-teal-300' : 'text-slate-500'}`}>
                    {slot.date}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                </div>

                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <Clock className="w-4 h-4 opacity-75" />
                  <span>{slot.time}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 italic col-span-3">No open slots available currently.</p>
        )}
      </div>

      {selectedSlot && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Selected: <strong>{selectedSlot.date}</strong> at <strong>{selectedSlot.time}</strong> (Virtual Conference)</span>
          </div>

          <Button
            variant="gradient"
            size="md"
            isLoading={isSubmitting}
            onClick={() => onConfirmSlot(selectedSlot)}
          >
            Confirm & Lock Slot (POST /confirm-slot)
          </Button>
        </div>
      )}
    </div>
  );
};

export default SlotSelector;
