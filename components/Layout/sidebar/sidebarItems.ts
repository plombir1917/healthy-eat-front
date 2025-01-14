import {
  BorderAllIcon,
  AlertCircleIcon,
  CircleDotIcon,
  BoxMultiple1Icon,
  AdjustmentsHorizontalIcon,
  LayoutDashboardIcon,
} from 'vue-tabler-icons';

export interface Menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: Menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: Menu[] = [
  { header: 'Главная' },
  {
    title: 'Панель управления',
    icon: LayoutDashboardIcon,
    to: '/',
  },
  { header: 'Утилиты' },
  {
    title: 'Уведомления',
    icon: AlertCircleIcon,
    to: '/ui-components/alerts',
  },
  {
    title: 'Кнопки',
    icon: CircleDotIcon,
    to: '/ui-components/buttons',
  },
  {
    title: 'Карточки',
    icon: BoxMultiple1Icon,
    to: '/ui-components/cards',
  },
  {
    title: 'Карусель',
    icon: AdjustmentsHorizontalIcon,
    to: '/ui-components/curousel',
  },
  {
    title: 'Таблицы',
    icon: BorderAllIcon,
    to: '/ui-components/tabels',
  },
];

export default sidebarItem;
