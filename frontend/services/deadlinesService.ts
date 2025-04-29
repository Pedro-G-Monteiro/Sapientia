import { DeadlineItemProps } from '@/components/ui/Deadlines/DeadlineItem';

// Função para gerar datas relativas ao dia atual
const getRelativeDate = (daysFromNow: number, hoursOffset = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(date.getHours() + hoursOffset);
  return date;
};

// Dados simulados para prazos de entrega
export const getMockDeadlines = (): DeadlineItemProps[] => {
  return [
    {
      id: 1,
      title: 'Submit Final Project',
      courseTitle: 'Web Development with Next.js',
      dueDate: getRelativeDate(1, 12),
      completed: false,
      progress: 75,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Complete Module Assessment',
      courseTitle: 'React Fundamentals',
      dueDate: getRelativeDate(0, 6), // Hoje, daqui a 6 horas
      completed: false,
      progress: 50,
      priority: 'high'
    },
    {
      id: 3,
      title: 'Read Chapter 5',
      courseTitle: 'JavaScript Essentials',
      dueDate: getRelativeDate(3),
      completed: false,
      progress: 30,
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Team Project Milestone',
      courseTitle: 'Agile Development',
      dueDate: getRelativeDate(5),
      completed: false,
      progress: 10,
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Code Review Submission',
      courseTitle: 'Advanced TypeScript',
      dueDate: getRelativeDate(-1), // Atrasado (ontem)
      completed: false,
      progress: 90,
      priority: 'high'
    },
    {
      id: 6,
      title: 'Quiz on Components',
      courseTitle: 'React Fundamentals',
      dueDate: getRelativeDate(-3),
      completed: true,
      progress: 100,
      priority: 'medium'
    },
  ];
};

// Função para obter apenas os prazos próximos não concluídos
export const getUpcomingDeadlines = (): DeadlineItemProps[] => {
  const allDeadlines = getMockDeadlines();
  
  // Filtramos para retornar apenas os prazos não concluídos, incluindo os atrasados
  return allDeadlines
    .filter(deadline => !deadline.completed)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

// Função para obter apenas os prazos concluídos
export const getCompletedDeadlines = (): DeadlineItemProps[] => {
  return getMockDeadlines().filter(deadline => deadline.completed);
};