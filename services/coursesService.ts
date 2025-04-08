// services/courseService.ts

import { CourseCardProps } from '@/components/ui/Cards/Courses/CourseCard';

// Interface representing the database course structure
export interface CourseData {
	course_id: number;
	organization_id: number | null;
	title: string;
	description: string | null;
	thumbnail_url: string | null;
	level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | null;
	duration_hours: number | null;
	price: number | null;
	is_free: boolean;
	is_published: boolean;
	is_public: boolean;
	created_by: number;
	created_at: string;
	updated_at: string;
	// Added fields from joins
	organization_name?: string;
	organization_logo_url?: string;
	creator_first_name?: string;
	creator_last_name?: string;
}

// Interface for enrollment data
export interface EnrollmentData {
	enrollment_id: number;
	user_id: number;
	course_id: number;
	enrollment_date: string;
	completion_date: string | null;
	is_completed: boolean;
	progress_percentage: number;
}

// Get all courses
export const fetchCourses = async (): Promise<CourseData[]> => {
	try {
		const response = await fetch('/api/courses');
		if (!response.ok) {
			throw new Error('Failed to fetch courses');
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching courses:', error);
		return [];
	}
};

// Get courses by organization ID
export const fetchCoursesByOrganization = async (
	organizationId: number
): Promise<CourseData[]> => {
	try {
		const response = await fetch(
			`/api/organizations/${organizationId}/courses`
		);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch courses for organization ${organizationId}`
			);
		}
		return await response.json();
	} catch (error) {
		console.error(
			`Error fetching courses for organization ${organizationId}:`,
			error
		);
		return [];
	}
};

// Get user enrollments
export const fetchUserEnrollments = async (
	userId: number
): Promise<EnrollmentData[]> => {
	try {
		const response = await fetch(`/api/users/${userId}/enrollments`);
		if (!response.ok) {
			throw new Error(`Failed to fetch enrollments for user ${userId}`);
		}
		return await response.json();
	} catch (error) {
		console.error(`Error fetching enrollments for user ${userId}:`, error);
		return [];
	}
};

// Get courses that user is enrolled in
export const fetchUserCourses = async (
	userId: number
): Promise<CourseCardProps[]> => {
	try {
		// Fetch enrollments and courses in parallel
		const [enrollmentsResponse, coursesResponse] = await Promise.all([
			fetch(`/api/users/${userId}/enrollments`),
			fetch(`/api/users/${userId}/courses`),
		]);

		if (!enrollmentsResponse.ok || !coursesResponse.ok) {
			throw new Error(`Failed to fetch user courses data`);
		}

		const enrollments: EnrollmentData[] = await enrollmentsResponse.json();
		const courses: CourseData[] = await coursesResponse.json();

		// Map database model to component props
		return courses.map((course) => {
			// Find enrollment data for this course
			const enrollment = enrollments.find(
				(e) => e.course_id === course.course_id
			);

			return {
				courseId: course.course_id,
				title: course.title,
				description: course.description || undefined,
				thumbnailUrl: course.thumbnail_url || undefined,
				level: course.level || undefined,
				durationHours: course.duration_hours || undefined,
				progress: enrollment?.progress_percentage || 0,
				isEnrolled: !!enrollment,
				isCompleted: enrollment?.is_completed || false,
				isFree: course.is_free,
				isPublished: course.is_published,
				createdBy: course.created_by
					? {
							userId: course.created_by,
							firstName: course.creator_first_name || '',
							lastName: course.creator_last_name || '',
					  }
					: undefined,
				organization: course.organization_id
					? {
							name: course.organization_name || '',
							logoUrl: course.organization_logo_url,
					  }
					: undefined,
			};
		});
	} catch (error) {
		console.error(`Error fetching user courses:`, error);
		return [];
	}
};

// Get recommended courses for user
export const fetchRecommendedCourses = async (
	userId: number
): Promise<CourseCardProps[]> => {
	try {
		const response = await fetch(`/api/users/${userId}/recommended-courses`);
		if (!response.ok) {
			throw new Error(`Failed to fetch recommended courses`);
		}

		const courses: CourseData[] = await response.json();

		// Map database model to component props
		return courses.map((course) => ({
			courseId: course.course_id,
			title: course.title,
			description: course.description || undefined,
			thumbnailUrl: course.thumbnail_url || undefined,
			level: course.level || undefined,
			durationHours: course.duration_hours || undefined,
			isFree: course.is_free,
			isPublished: course.is_published,
			createdBy: course.created_by
				? {
						userId: course.created_by,
						firstName: course.creator_first_name || '',
						lastName: course.creator_last_name || '',
				  }
				: undefined,
			organization: course.organization_id
				? {
						name: course.organization_name || '',
						logoUrl: course.organization_logo_url,
				  }
				: undefined,
		}));
	} catch (error) {
		console.error(`Error fetching recommended courses:`, error);
		return [];
	}
};

// Get new courses
export const fetchNewCourses = async (
	limit: number = 10
): Promise<CourseCardProps[]> => {
	try {
		const response = await fetch(`/api/courses/new?limit=${limit}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch new courses`);
		}

		const courses: CourseData[] = await response.json();

		// Map database model to component props
		return courses.map((course) => ({
			courseId: course.course_id,
			title: course.title,
			description: course.description || undefined,
			thumbnailUrl: course.thumbnail_url || undefined,
			level: course.level || undefined,
			durationHours: course.duration_hours || undefined,
			isFree: course.is_free,
			isPublished: course.is_published,
			createdBy: course.created_by
				? {
						userId: course.created_by,
						firstName: course.creator_first_name || '',
						lastName: course.creator_last_name || '',
				  }
				: undefined,
			organization: course.organization_id
				? {
						name: course.organization_name || '',
						logoUrl: course.organization_logo_url,
				  }
				: undefined,
		}));
	} catch (error) {
		console.error(`Error fetching new courses:`, error);
		return [];
	}
};

// Função para obter um curso específico pelo ID
export const getMockCourseById = async (courseId: number): Promise<CourseCardProps | null> => {
  // Simulação de uma chamada de API com um pequeno delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const allCourses = getMockCourses();
      const course = allCourses.find(course => course.courseId === courseId);
      resolve(course || null);
    }, 500);
  });
};

// Mock data for testing the course card component
export const getMockCourses = (): CourseCardProps[] => {
	return [
		{
			courseId: 1,
			title: 'Introduction to JavaScript',
			description: 'Learn the basics of JavaScript programming language.',
			thumbnailUrl: 'https://example.com/js-thumbnail.jpg',
			level: 'Beginner',
			durationHours: 6,
			progress: 25,
			isEnrolled: true,
			isCompleted: false,
			isFree: true,
			organization: {
				name: 'Universidade de Lisboa',
			},
		},
		{
			courseId: 2,
			title: 'Advanced React Patterns',
			description:
				'Master advanced React patterns and performance optimization techniques.',
			thumbnailUrl: 'https://example.com/react-thumbnail.jpg',
			level: 'Advanced',
			durationHours: 8,
			progress: 75,
			isEnrolled: true,
			isCompleted: false,
			isFree: false,
			organization: {
				name: 'Universidade de Lisboa',
			},
		},
		{
			courseId: 3,
			title: 'Data Science Fundamentals',
			description: 'Introduction to data science concepts and tools.',
			thumbnailUrl: 'https://example.com/data-science-thumbnail.jpg',
			level: 'Intermediate',
			durationHours: 12,
			isEnrolled: false,
			isFree: false,
			organization: {
				name: 'Universidade de Lisboa',
			},
		},
		{
			courseId: 4,
			title: 'UX/UI Design Principles',
			description:
				'Learn essential principles of user experience and interface design.',
			level: 'All Levels',
			durationHours: 5,
			progress: 100,
			isEnrolled: true,
			isCompleted: true,
			isFree: true,
			organization: {
				name: 'Universidade do Porto',
			},
		},
		{
			courseId: 5,
			title: 'Introduction to Python',
			description: 'Learn the basics of Python programming language.',
			thumbnailUrl: 'https://example.com/python-thumbnail.jpg',
			level: 'Beginner',
			durationHours: 6,
			isEnrolled: false,
			isFree: true,
			organization: {
				name: 'Universidade do Porto',
			},
		},
		{
			courseId: 6,
			title: 'Web Development Bootcamp',
			description: 'Intensive bootcamp to learn full-stack web development.',
			thumbnailUrl: 'https://example.com/web-dev-thumbnail.jpg',
			level: 'Advanced',
			durationHours: 24,
			isEnrolled: false,
			isFree: false,
			organization: {
				name: 'Universidade do Porto',
			},
		},
		{
			courseId: 7,
			title: 'Introduction to JavaScript',
			description: 'Learn the basics of JavaScript programming language.',
			thumbnailUrl: 'https://example.com/js-thumbnail.jpg',
			level: 'Beginner',
			durationHours: 6,
			progress: 25,
			isEnrolled: true,
			isCompleted: false,
			isFree: true,
			organization: {
				name: 'Universidade de Lisboa',
			},
		},
		{
			courseId: 8,
			title: 'Advanced React Patterns',
			description:
				'Master advanced React patterns and performance optimization techniques.',
			thumbnailUrl: 'https://example.com/react-thumbnail.jpg',
			level: 'Advanced',
			durationHours: 8,
			progress: 75,
			isEnrolled: true,
			isCompleted: false,
			isFree: false,
			organization: {
				name: 'Universidade de Lisboa',
			},
		},
	];
};
