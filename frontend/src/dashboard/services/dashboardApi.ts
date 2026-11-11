import { getContentHistory } from '../../content/services/contentApi';
import type { DashboardHistory } from '../types/dashboard.types';

export async function getRecentContent(): Promise<DashboardHistory> {
  return getContentHistory({ page: 1, limit: 6 });
}
