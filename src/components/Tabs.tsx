import { Button } from "./Button";

export type TabDefinition = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: TabDefinition[];
  activeTab: string;
  onChange: (tabId: string) => void;
};

export const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
    {tabs.map((tab) => (
      <Button
        key={tab.id}
        variant={activeTab === tab.id ? "primary" : "secondary"}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </Button>
    ))}
  </div>
);

