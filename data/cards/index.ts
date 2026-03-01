import { RoleType, Card } from '../../types';
import { DEVELOPMENT_CARDS } from './development';
import { MARKETING_CARDS } from './marketing';
import { MANAGEMENT_CARDS } from './management';
import { HR_CARDS } from './hr';
import { FINANCE_CARDS } from './finance';
import { CLEANING_CARDS } from './cleaning';

export { DEVELOPMENT_CARDS } from './development';
export { MARKETING_CARDS } from './marketing';
export { MANAGEMENT_CARDS } from './management';
export { HR_CARDS } from './hr';
export { FINANCE_CARDS } from './finance';
export { CLEANING_CARDS } from './cleaning';

export const ROLE_CARDS: Record<RoleType, Card[]> = {
  [RoleType.DEVELOPMENT]: DEVELOPMENT_CARDS,
  [RoleType.MARKETING]: MARKETING_CARDS,
  [RoleType.MANAGEMENT]: MANAGEMENT_CARDS,
  [RoleType.HR]: HR_CARDS,
  [RoleType.FINANCE]: FINANCE_CARDS,
  [RoleType.CLEANING]: CLEANING_CARDS
};
