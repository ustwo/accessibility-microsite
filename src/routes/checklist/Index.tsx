import ChecklistTemplate from "../../components/ChecklistTemplate";
import perceivableData from "../../data/checklist-perceivable.json";
import operableData from "../../data/checklist-operable.json";
import understandableData from "../../data/checklist-understandable.json";
import robustData from "../../data/checklist-robust.json";

export default function ChecklistIndex() {
  const allData = {
    perceivable: perceivableData,
    operable: operableData,
    understandable: understandableData,
    robust: robustData,
  };

  return (
    <ChecklistTemplate title="WCAG Checklist" allData={allData} />
  );
} 