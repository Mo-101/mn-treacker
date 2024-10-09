import { HomeIcon, BarChart2 } from "lucide-react";
import Index from "./pages/Index.jsx";
import Analytics from "./pages/Analytics.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart2 className="h-4 w-4" />,
    page: <Analytics />,
  },
];