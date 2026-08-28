import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

export default function TabLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}