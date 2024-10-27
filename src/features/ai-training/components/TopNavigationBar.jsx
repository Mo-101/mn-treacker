import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const TopNavigationBar = ({ navItems, activeSection, setActiveSection, onClose }) => {
  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-2 flex justify-between items-center"
    >
      <div className="flex space-x-2">
        {navItems.map((item) => (
          <Button
            key={item.section}
            variant={activeSection === item.section ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection(item.section)}
            className="text-white"
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </div>
      <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
        <X className="h-5 w-5" />
      </Button>
    </motion.nav>
  );
};

export default TopNavigationBar;