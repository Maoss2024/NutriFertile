import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Lock } from 'lucide-react';
import { useCourseStore } from '../store/courseStore';
import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useAuthModalStore } from '../store/authModalStore';

export function CoursesPage() {
  const { t } = useTranslation();
  const { courses, loading } = useCourseStore();
  const { user } = useAuthStore();
  const { hasPremiumAccess } = useSubscriptionStore();
  const { openAuthModal } = useAuthModalStore();

  const categories = [
    { id: 'emotional', title: t('features.emotional.title') },
    { id: 'pregnancy', title: t('features.pregnancy.title') },
    { id: 'hormones', title: t('courses.hormones.title') }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="bg-gray-100 rounded-xl h-64"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category) => (
          <div key={category.id} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(course => course.title.toLowerCase().includes(category.id))
                .map((course) => (
                  <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                      <img 
                        src={course.thumbnail_url || `https://img.youtube.com/vi/${course.video_id}/maxresdefault.jpg`}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity">
                        {course.is_premium && !hasPremiumAccess ? (
                          <Lock className="h-12 w-12 text-white" />
                        ) : (
                          <Play className="h-12 w-12 text-white" />
                        )}
                      </div>
                      {course.is_premium && (
                        <div className="absolute top-4 right-4 bg-[#ed0d53] text-white px-3 py-1 rounded-full text-sm font-medium">
                          Premium
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                      <button 
                        onClick={() => !user && openAuthModal()}
                        className={`text-lg font-medium transition-colors ${
                          course.is_premium && !hasPremiumAccess
                            ? "text-[#ed0d53] hover:text-[#d50c4b]"
                            : "text-[#7AB80E] hover:text-[#689A0D]"
                        }`}
                      >
                        {!user 
                          ? t('courses.loginToAccess')
                          : course.is_premium && !hasPremiumAccess
                            ? "Upgrade to Premium →"
                            : t('courses.learnMore')
                        }
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}