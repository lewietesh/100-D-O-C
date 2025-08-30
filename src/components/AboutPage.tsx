'use client';

import { motion } from 'framer-motion';
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowDownTrayIcon,
  LinkIcon,
  StarIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  UserIcon,
  CalendarIcon,
  BriefcaseIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram
} from 'react-icons/fa';
import { useAboutPageData } from '@/hooks/useAboutPageData';
import RoadMap from '@/components/Roadmap';

// Icon mappings for stats and reasons
const iconMap: { [key: string]: React.ReactNode } = {
  'code': <CodeBracketIcon className="w-8 h-8" />,
  'rocket': <RocketLaunchIcon className="w-8 h-8" />,
  'users': <UserIcon className="w-8 h-8" />,
  'calendar': <CalendarIcon className="w-8 h-8" />,
  'briefcase': <BriefcaseIcon className="w-8 h-8" />,
  'trophy': <TrophyIcon className="w-8 h-8" />,
  'star': <StarIcon className="w-8 h-8" />,
  'fast-forward': <RocketLaunchIcon className="w-8 h-8" />
};

// Social icons mapping
const socialIcons: { [key: string]: { icon: React.ReactNode; label: string; color: string } } = {
  git: { icon: <FaGithub />, label: 'GitHub', color: 'hover:text-gray-700 dark:hover:text-gray-300' },
  linkedin: { icon: <FaLinkedin />, label: 'LinkedIn', color: 'hover:text-blue-600' },
  x: { icon: <FaTwitter />, label: 'X (Twitter)', color: 'hover:text-blue-400' },
  ig: { icon: <FaInstagram />, label: 'Instagram', color: 'hover:text-pink-500' }
};

export default function AboutPage() {
  const { data, loading, error } = useAboutPageData();
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || '/resume.pdf';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading About Page</h2>
          <p className="text-gray-600 dark:text-gray-400">Getting to know me better...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/50 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Failed to Load</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { contactInfo, whyChooseUs, workExperience, aboutStats, aboutSection, roadMap } = data;

  return (
    <main className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-400/10 to-blue-600/10 blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <UserIcon className="w-4 h-4" />
                About Me
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {aboutSection?.title || `Hi, I'm ${contactInfo?.brand_name || 'Lewis'}`}
              </h1>

              <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {aboutSection?.description ? (
                  <div
                    className="prose prose-lg prose-neutral dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: aboutSection.description.replace(/\n/g, '<br />')
                    }}
                  />
                ) : (
                  // Your existing fallback content
                  <>
                    <p className="mb-4">
                      A passionate <span className="font-semibold text-gray-900 dark:text-white">Full-Stack Developer</span>...
                    </p>
                  </>
                )}
              </div>

              {/* Quick Contact & Social */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>Let's Work Together</span>
                </a>

                <a
                  href={resumeUrl}
                  download
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Download Resume</span>
                </a>
              </div>

              {/* Social Links */}
              {contactInfo?.social_links && (
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Connect on social media:</span>
                  <div className="flex gap-3">
                    {Object.entries(contactInfo.social_links).map(([key, url]) => {
                      const socialData = socialIcons[key];
                      return url && socialData ? (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 dark:text-gray-400 ${socialData.color}`}
                          title={socialData.label}
                        >
                          {socialData.icon}
                        </a>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Profile Image & Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Profile Image */}
                <div className="w-120 h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                  {aboutSection?.media_url ? (
                    <img
                      src={aboutSection.media_url}
                      alt={aboutSection.title || "About Me"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to user icon if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-32 h-32 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                      }}
                    />
                  ) : (
                    <UserIcon className="w-32 h-32 text-blue-600 dark:text-blue-400" />
                  )}
                </div>

                {/* Floating Contact Card */}
                {/* <div className="absolute -bottom-6 -right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className="space-y-2 text-sm">
                    {contactInfo?.email && (
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300">{contactInfo.email}</span>
                      </div>
                    )}
                    {contactInfo?.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-gray-700 dark:text-gray-300">{contactInfo.phone}</span>
                      </div>
                    )}
                    {contactInfo?.location && (
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-gray-700 dark:text-gray-300">{contactInfo.location}</span>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Stats Section */}
      {aboutStats.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {aboutStats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 text-center hover:shadow-2xl transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                    {iconMap[stat.icon_name] || <StarIcon className="w-8 h-8" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.stat_name}
                  </h3>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    {stat.stat_value}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {stat.stat_description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Why Choose Me Section */}
      {whyChooseUs.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <StarIcon className="w-4 h-4" />
                Why Choose Me
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              >
                What Sets Me Apart
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              >
                Here's why clients trust me with their most important projects
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((reason, index) => (
                <motion.div
                  key={reason.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                    {iconMap[reason.icon_name] || <StarIcon className="w-7 h-7" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {reason.reason_title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {reason.reason_description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Work Experience Section */}
      {workExperience.length > 0 && (
        <section className="py-20 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <BriefcaseIcon className="w-4 h-4" />
                Professional Experience
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Where I've Worked
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {workExperience.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Company Header */}
                  <div className="flex items-start gap-4 mb-6">
                    {experience.company_logo ? (
                      <img
                        src={experience.company_logo}
                        alt={experience.company_name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BriefcaseIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {experience.job_title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {experience.company_name}
                        </span>
                        {experience.company_website && (
                          <a
                            href={experience.company_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span>{experience.duration_text}</span>
                        <span>•</span>
                        <span>{experience.industry}</span>
                        {experience.is_current && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Key Achievements */}
                  {experience.achievements && experience.achievements.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <TrophyIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {experience.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technology Stack */}
                  {experience.technology_stack && experience.technology_stack.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <CodeBracketIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.technology_stack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Experience Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{workExperience.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Companies</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.round(workExperience.reduce((acc, exp) => acc + exp.duration_months, 0) / 12 * 10) / 10}+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {[...new Set(workExperience.flatMap(exp => exp.technology_stack || []))].length}+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {[...new Set(workExperience.map(exp => exp.industry))].length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Industries</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Process/Roadmap Section */}
      <RoadMap milestones={roadMap} />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you have a clear vision or just an idea, I'm here to help turn your concepts
              into reality. Let's discuss your project and create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <EnvelopeIcon className="w-5 h-5" />
                <span>Start a Project</span>
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-300 dark:border-gray-600 transition-all duration-200"
              >
                <RocketLaunchIcon className="w-5 h-5" />
                <span>View Services</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}