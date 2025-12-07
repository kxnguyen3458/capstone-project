import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { serviceCategory } from "@/constants";

type HomeFilterProps = {
  selectedServiceIds: string[];
  onChange: (ids: string[]) => void;
};

const HomeFilter: React.FC<HomeFilterProps> = ({
  selectedServiceIds,
  onChange,
}) => {
  const serviceCategoryList = useMemo(
    () =>
      Array.from(serviceCategory.entries()).map(([id, label]) => ({
        id,
        label,
      })),
    []
  );

  const handleToggle = (id: string, checked: boolean) => {
    if (checked) {
      if (!selectedServiceIds.includes(id)) {
        onChange([...selectedServiceIds, id]);
      }
    } else {
      onChange(selectedServiceIds.filter((s) => s !== id));
    }
  };

  return (
    <div>
      <h4 className="my-5 font-semibold">Services</h4>
      <div className="flex flex-col gap-3">
        {serviceCategoryList.map((service) => (
          <div key={service.id} className="flex items-center gap-3">
            <Checkbox
              id={service.id}
              checked={selectedServiceIds.includes(service.id)}
              onCheckedChange={(value) =>
                handleToggle(service.id, Boolean(value))
              }
            />
            <Label htmlFor={service.id}>{service.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeFilter;
