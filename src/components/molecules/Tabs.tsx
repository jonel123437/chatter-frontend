// Molecule: Tabs.tsx
import { useState, ReactNode } from "react";
import TabButton from "../atoms/TabButton";

interface TabsProps {
  tabs: { label: string; content: ReactNode }[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.label}
            active={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
      <div className="mt-4">{tabs[activeIndex].content}</div>
    </div>
  );
}
