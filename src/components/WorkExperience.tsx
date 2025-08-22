// components/WorkExperience.tsx
'use client';

import React, { useState } from 'react';
import { ChevronRight, ExternalLink, MapPin, Calendar, Code, Trophy, Briefcase } from 'lucide-react';

interface WorkExperience {
  id: number;
  company_name: string;
  job_title: string;
  industry: string;
  company_logo?: string;
  company_website?: string;
  start_month: number;
  start_year: number;
  end_month?: number;
  end_year?: number;
  is_current: boolean;
  description: string;
  key_responsibilities?: string[];
  achievements?: string[];
  technology_stack?: string[];
  duration_text: string;
  duration_months: number;
}

interface WorkExperienceProps {
  experiences: WorkExperience[];
  title?: string;
  className?: string;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({
  experiences,
  title = "Where I've Worked",
  className = ""
}) => {
  const [activeExperience, setActiveExperience] = useState<number>(0);

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const currentExperience = experiences[activeExperience];

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-inverse mb-4 flex items-center gap-3">
            <span className="text-primary-500 font-mono text-xl">02.</span>
            {title}
          </h2>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Company Tabs - Left Side */}
          <div className="lg:col-span-4">
            <div className="space-y-2">
              {experiences.map((exp, index) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveExperience(index)}
                  className={`w-full text-left p-4 rounded-lg border-l-4 transition-all duration-300 group ${
                    activeExperience === index
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-border-light hover:border-primary-300 hover:bg-light-tertiary text-text-secondary hover:text-text-inverse'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Company Logo or Icon */}
                    <div className="flex-shrink-0">
                      {exp.company_logo ? (
                        <img
                          src={exp.company_logo}
                          alt={exp.company_name}
                          className="w-8 h-8 rounded object-contain"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-primary-500" />
                        </div>
                      )}
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm">
                        {exp.company_name}
                      </div>
                      <div className="text-xs opacity-75 truncate">
                        {exp.industry}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <ChevronRight 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeExperience === index ? 'rotate-90' : 'group-hover:translate-x-1'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Experience Details - Right Side */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-soft border border-border-light p-8 animate-fade-in">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-text-inverse mb-2">
                      {currentExperience.job_title}
                      <span className="text-primary-500 ml-2">@</span>
                      <span className="text-primary-500 ml-1">
                        {currentExperience.company_name}
                      </span>
                    </h3>
                    
                    <div className="flex items-center gap-4 text-text-secondary text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{currentExperience.duration_text}</span>
                      </div>
                      
                      {currentExperience.industry && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{currentExperience.industry}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Website Link */}
                  {currentExperience.company_website && (
                    <a
                      href={currentExperience.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors duration-200 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Company
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-text-inverse leading-relaxed">
                  {currentExperience.description}
                </p>
              </div>

              {/* Key Responsibilities */}
              {currentExperience.key_responsibilities && currentExperience.key_responsibilities.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-text-inverse mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary-500" />
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {currentExperience.key_responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3 text-text-inverse text-sm">
                        <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              {currentExperience.achievements && currentExperience.achievements.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-text-inverse mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-cta-500" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {currentExperience.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3 text-text-inverse text-sm">
                        <ChevronRight className="w-4 h-4 text-cta-500 mt-0.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technology Stack */}
              {currentExperience.technology_stack && currentExperience.technology_stack.length > 0 && (
                <div>
                  <h4 className="font-semibold text-text-inverse mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4 text-success-500" />
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentExperience.technology_stack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-success-50 text-success-700 rounded-full text-sm font-medium border border-success-200 hover:bg-success-100 transition-colors duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Dots (Mobile/Tablet Enhancement) */}
            <div className="flex justify-center mt-6 lg:hidden">
              <div className="flex gap-2">
                {experiences.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveExperience(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      activeExperience === index
                        ? 'bg-primary-500 scale-125'
                        : 'bg-border-light hover:bg-primary-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Summary Stats */}
        <div className="mt-12 pt-8 border-t border-border-light">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">
                {experiences.length}
              </div>
              <div className="text-text-secondary text-sm">Companies</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">
                {Math.round(experiences.reduce((acc, exp) => acc + exp.duration_months, 0) / 12 * 10) / 10}+
              </div>
              <div className="text-text-secondary text-sm">Years Experience</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">
                {[...new Set(experiences.flatMap(exp => exp.technology_stack || []))].length}+
              </div>
              <div className="text-text-secondary text-sm">Technologies</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">
                {[...new Set(experiences.map(exp => exp.industry))].length}
              </div>
              <div className="text-text-secondary text-sm">Industries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;