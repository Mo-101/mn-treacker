import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Training from "./pages/Training";
import Predictions from "./pages/Predictions";

export const navItems = [
  {
    to: "/",
    page: <Index />,
    label: "Map",
  },
  {
    to: "/analytics",
    page: <Analytics />,
    label: "Analytics",
  },
  {
    to: "/training",
    page: <Training />,
    label: "Training",
  },
  {
    to: "/predictions",
    page: <Predictions />,
    label: "Predictions",
  },
];