// components/RoadMap.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon,
  LightBulbIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { RoadMapMilestone } from '@/types/about';

interface RoadMapProps {
  milestones: RoadMapMilestone[];
  title?: string;
  description?: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
  'rotate-ccw': <LightBulbIcon className="w-6 h-6" />,
  'code': <CodeBracketIcon className="w-6 h-6" />,
  'rocket': <RocketLaunchIcon className="w-6 h-6" />,
  'wrench': <WrenchScrewdriverIcon className="w-6 h-6" />,
  'clock': <ClockIcon className="w-6 h-6" />,
  'check': <CheckCircleIcon className="w-6 h-6" />
};

const getDefaultIcon = (index: number) => {
  const icons = [
    <LightBulbIcon className="w-6 h-6" />,
    <CodeBracketIcon className="w-6 h-6" />,
    <RocketLaunchIcon className="w-6 h-6" />,
    <WrenchScrewdriverIcon className="w-6 h-6" />
  ];
  return icons[index % icons.length];
};

export default function RoadMap({ 
  milestones, 
  title = "What to Expect",
  description = "My proven process to deliver exceptional results"
}: RoadMapProps) {
  if (!milestones || milestones.length === 0) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClockIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Process Coming Soon
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Our detailed development process will be outlined here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <RocketLaunchIcon className="w-4 h-4" />
            Development Process
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-0.5 top-16 bottom-16 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-full"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col md:justify-between`}
              >
                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 w-16 h-16 bg-white dark:bg-gray-800 rounded-full border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg flex items-center justify-center z-10">
                  <div className={`p-2 rounded-full ${
                    milestone.is_completed 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }`}>
                    {milestone.is_completed ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      iconMap[milestone.icon_name] || getDefaultIcon(index)
                    )}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 ml-24 md:ml-0 ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                }`}>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                    {/* Step Number */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                        Step {index + 1}
                      </span>
                      {milestone.is_completed && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium px-3 py-1 rounded-full">
                          Completed
                        </span>
                      )}
                      {milestone.target_date && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm px-3 py-1 rounded-full">
                          {new Date(milestone.target_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {milestone.milestone_title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                      {milestone.milestone_description}
                    </p>

                    {/* Timeline Info */}
                    <div className="flex items-center gap-4 text-sm">
                      {milestone.completion_date && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Completed {new Date(milestone.completion_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {milestone.target_date && !milestone.is_completed && (
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <ClockIcon className="w-4 h-4" />
                          <span>Target: {new Date(milestone.target_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Let's discuss your requirements and create a tailored plan that follows this proven process.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <span>Start Your Project</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}