import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TodayPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const continuelearning = [
    {
      id: 1,
      title: t('courses.miscarriage.title'),
      description: t('courses.miscarriage.description'),
      progress: 45,
      thumbnail: `https://img.youtube.com/vi/1UKXWoe-byY/maxresdefault.jpg`,
    },
    {
      id: 2,
      title: t('courses.endocrine.title'),
      description: t('courses.endocrine.description'),
      progress: 20,
      thumbnail: `https://img.youtube.com/vi/vJv4aYiXTLM/maxresdefault.jpg`,
    }
  ];

  const freePrograms = [
    {
      id: 3,
      title: t('courses.hormones.title'),
      description: t('courses.hormones.description'),
      duration: '45 min',
      thumbnail: `https://img.youtube.com/vi/c78OgFqtggI/maxresdefault.jpg`,
    },
    {
      id: 4,
      title: t('features.emotional.title'),
      description: t('features.emotional.description'),
      duration: '30 min',
      thumbnail: `https://img.youtube.com/vi/VvR6WdJdTis/maxresdefault.jpg`,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Continue Learning Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">{t('today.continuelearning', 'Continue Learning')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {continuelearning.map((course) => (
              <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img 
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div 
                      className="h-full bg-[#7AB80E]" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{course.progress}% completed</span>
                    <button className="text-[#7AB80E] hover:text-[#689A0D] font-medium">
                      {t('today.continue', 'Continue →')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Free Programs Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">{t('today.freePrograms', 'Free Programs For You')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {freePrograms.map((program) => (
              <div key={program.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img 
                    src={program.thumbnail}
                    alt={program.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{program.duration}</span>
                    <button className="text-[#7AB80E] hover:text-[#689A0D] font-medium">
                      {t('today.start', 'Start Now →')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Membership Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-[#7AB80E] to-[#ed0d53] rounded-xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t('today.membershipTitle', "Nutri'Fertile Membership")}
                </h2>
                <p className="text-white/90 mb-6">
                  {t('today.membershipDescription', 'Get unlimited access to all our premium content and expert guidance.')}
                </p>
                <button 
                  onClick={() => navigate('/pricing')}
                  className="bg-white text-[#7AB80E] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  <Crown className="h-5 w-5" />
                  {t('today.joinNow', 'Join Now')}
                </button>
              </div>
              <div className="w-full md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80"
                  alt="Healthy Lifestyle"
                  className="w-full h-full object-cover aspect-[4/3] md:aspect-auto"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}