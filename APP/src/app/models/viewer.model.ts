export interface ViewerWidget {
    id?: number;
    name: string;
    title: string;
    icon: string;
    position: 'start' | 'end';
    default: boolean;
    order: number;
  }