import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const VendorProfileRequiredMessage = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
      <div className="bg-white border border-slate-200 shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2">
          You need to create your vendor profile
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Before you can register services, please finish setting up your vendor
          profile.
        </p>

        <Button
          className="w-full"
          onClick={() => navigate("/profile")}
        >
          Create Profile
        </Button>
      </div>
    </div>
  );
};

export default VendorProfileRequiredMessage;
