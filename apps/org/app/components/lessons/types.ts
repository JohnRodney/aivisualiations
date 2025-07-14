export interface LessonObjective {
  title: string;
  description: string;
}

export interface LessonData {
  id: string;
  title: string;
  objective: LessonObjective;
  explanation: string;
  canvasComponent: React.ComponentType<any>;
  canvasProps?: Record<string, any>;
  keyTakeaways: string[];
  nextButtonText?: string;
  completionCriteria?: string;
}

export interface LessonContainerProps {
  lessons: LessonData[];
  title: string;
  description: string;
  onComplete?: () => void;
}
