import { create } from 'zustand';
import { Course } from '../types/database';
import { supabase } from '../lib/supabase';

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  loading: false,
  error: null,
  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ courses: data as Course[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));