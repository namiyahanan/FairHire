import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { Send, Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const FeedbackForm = ({ candidateId, onSubmitFeedback, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    rating: 4,
    recommendation: 'Strong Hire',
    technicalSkills: 4.5,
    problemSolving: 4.0,
    communication: 4.5,
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback({
      candidateId,
      ...formData,
      rating: parseFloat(formData.rating),
      technicalSkills: parseFloat(formData.technicalSkills),
      problemSolving: parseFloat(formData.problemSolving),
      communication: parseFloat(formData.communication)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      <div className="border-b border-slate-100 pb-4">
        <h4 className="text-base font-bold text-navy-900">Interviewer Structured Feedback</h4>
        <p className="text-xs text-slate-500">Record objective candidate evaluations and submit directly to HR pipeline</p>
      </div>

      {/* Ratings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          label="Overall Recommendation"
          name="recommendation"
          value={formData.recommendation}
          onChange={handleChange}
          options={['Strong Hire', 'Hire', 'Hold / Neutral', 'Do Not Hire']}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex justify-between">
            <span>Overall Performance Rating</span>
            <span className="text-teal-600 font-bold">{formData.rating} / 5 Stars</span>
          </label>
          <div className="flex items-center gap-2 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className={`p-2 rounded-lg transition-all ${
                  star <= formData.rating ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-300'
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex justify-between">
            <span>Technical Proficiency</span>
            <span className="text-teal-600 font-bold">{formData.technicalSkills} / 5</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            name="technicalSkills"
            value={formData.technicalSkills}
            onChange={handleChange}
            className="accent-teal-500 cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex justify-between">
            <span>Problem Solving & Algorithmic Rigor</span>
            <span className="text-teal-600 font-bold">{formData.problemSolving} / 5</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            name="problemSolving"
            value={formData.problemSolving}
            onChange={handleChange}
            className="accent-teal-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Structured Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Interviewer Detailed Synthesis & Notes <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Detail specific technical strengths, answers to AI prompts, and recommendations for hiring committee..."
          className="w-full rounded-lg text-sm p-3.5 bg-white border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none text-slate-800"
          required
        />
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          isLoading={isSubmitting}
          icon={Send}
        >
          Submit Evaluation (POST /interviews/feedback)
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
